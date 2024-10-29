import { Server, Socket } from "net";
import GamePacket from "../Packets/GamePacket";
import GamePacketList from "../Packets/GamePacketList";
import S2C_ServerInfo from "../Packets/S2C/S2C_ServerInfo";

class Connection {
  private readonly _clientId: number;
  private readonly _socket: Socket;
  private readonly _peers: Connection[];
  private _isCompressed = false;
  private _isEncrypted = false;

  constructor(clientId: number, socket: Socket, peers: Connection[]) {
    this._clientId = clientId;
    this._socket = socket;
    this._peers = peers;

    this._socket.on("data", this.handlePacket);

    //handShake
    const serverInfo = S2C_ServerInfo.from(
      [
        0x01, 0x16, 0x10, 0x99, 0x00, 0xd0, 0xd0, 0x00, 0x00, 0x00, 0x00, 0xc2, 0xfe, 0xa5, 0x73, 0xbf, 0x6f, 0x80, 0xd7, 0x00, 0x01, 0x02, 0x06,
        0xff,
      ],
      GamePacketList
    );
    this.sendPacket(serverInfo);
  }

  public get clientId() {
    return this._clientId;
  }

  public sendPacket(packet: GamePacket) {
    this._socket.write(packet.getBytes());
  }

  public broadcastPacket() {}

  public handlePacket(data: Buffer) {
    const packet: GamePacket = GamePacket.from(data, GamePacketList);

    console.log("packetReceived", packet);
  }
}

class NetworkHandler {
  private _server: Server;
  private _peers: Connection[] = [];

  constructor(tcpServer: Server) {
    this._server = tcpServer;

    this._server.on("error", this.handleServerError);
    this._server.on("connection", this.handleConnection.bind(this));
  }

  private get peers() {
    return this._peers;
  }

  private handleServerError(error: Error) {
    console.log(`Server socket error: ${error.message}`);
  }

  private handleConnection(clientSocket: Socket) {
    const socketAddr = clientSocket.remoteAddress?.replace(/[^0-9]/g, "");
    const clientId = Number(`${socketAddr}${clientSocket.remotePort}${Date.now()}`);
    const filteredPeers = this.peers.filter((connection) => connection.clientId != clientId);

    clientSocket.on("close", (hadError) => this.handleDisconnection(clientId, hadError));

    console.log("Client connected");
    this._peers.push(new Connection(clientId, clientSocket, filteredPeers));
  }

  private handleDisconnection(clientId: number, hadError: boolean) {
    const peerIndex = this._peers.findIndex((connection) => connection.clientId === clientId);
    if (peerIndex >= 0) {
      this._peers.splice(peerIndex, 1);
      console.log("Client disconnected");
    } else {
      console.log(`Error: connection lost from a socket that wasn't found anymore: ${clientId}`);
    }
  }
}

export default NetworkHandler;
