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
    const serverInfo = new S2C_ServerInfo(0x00, 0xd0);
    this.sendPacket(serverInfo);
  }

  public get clientId() {
    return this._clientId;
  }

  public sendPacket(packet: GamePacket) {
    console.log("SENDING", packet);

    this._socket.write(packet.getBytes());
  }

  public broadcastPacket() {}

  public handlePacket(data: Buffer) {
    const receivedPacket: GamePacket = GamePacket.from(data, GamePacketList);

    console.log("RECEIVING", receivedPacket);
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
