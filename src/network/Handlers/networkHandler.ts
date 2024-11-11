import { Server, Socket } from "net";
import Connection from "./ConnectionHandler";
import GamePacket from "../Packets/GamePacket";
import PacketRouter from "./PacketRouter";

import S2C_ServerInfo from "../Packets/S2C/S2C_ServerInfo";
import HandleLoginAnnounce from "../Packets/PacketHandlers/HandleLoginAnnounce";
import HandleCMKey from "../Packets/PacketHandlers/HandleCMKey";
import HandleKeepAlive from "../Packets/PacketHandlers/HandleKeepAlive";
import HandleRoleList from "../Packets/PacketHandlers/HandleRoleList";

class NetworkHandler {
  private _server: Server;
  private _peers: Map<number, Connection> = new Map();
  private readonly _requestHandler: PacketRouter = new PacketRouter();

  constructor(tcpServer: Server) {
    this._server = tcpServer;

    this._server.on("error", (error) => console.log(`Server socket error: ${error.message}`));
    this._server.on("connection", this.handleConnection.bind(this));

    this.initPacketHandlers();
  }

  public getConnection(clientId: number) {
    const peer = this._peers.get(clientId);

    if (peer == undefined) throw new Error(`Connection with clientId [${clientId}] is undefined`);

    return peer;
  }

  private initPacketHandlers() {
    this._requestHandler.Register(new HandleLoginAnnounce());
    this._requestHandler.Register(new HandleCMKey());
    this._requestHandler.Register(new HandleKeepAlive());
    this._requestHandler.Register(new HandleRoleList());
  }

  public sendPacket(clientId: number, packet: GamePacket) {
    console.log("SENDING", packet);

    this._peers.get(clientId)?.send(packet.getBytes());
  }

  public broadcastPacket(packet: GamePacket) {
    console.log("BROADCASTING", packet);

    this._peers.forEach((Connection, clientId) => {
      Connection.send(packet.getBytes()); //@TODO: check if this is working
    });
  }

  private handlePacket(clientId: number, packet: GamePacket) {
    console.log("RECEIVING", packet);

    this._requestHandler.onMessage(clientId, packet);
  }

  private handleConnection(clientSocket: Socket) {
    const socketAddr = clientSocket.remoteAddress?.replace(/[^0-9]/g, "");
    const clientId = Number(`${socketAddr}${clientSocket.remotePort}${Date.now()}`);

    clientSocket.on("close", (hadError) => this.handleDisconnection(clientId, hadError));

    console.log("Client connected");
    this._peers.set(clientId, new Connection(clientId, clientSocket, this.handlePacket.bind(this)));

    //Sends a serverInfo packet as a handshake between client and server
    //@TODO: Unhardcode serverInfo values/packet from this method
    this.sendPacket(clientId, new S2C_ServerInfo(0x00, 0xd0));
  }

  private handleDisconnection(clientId: number, hadError: boolean) {
    if (this._peers.delete(clientId)) {
      console.log("Client disconnected");
    } else {
      console.log(`Error: connection lost from a socket that wasn't found anymore: ${clientId}`);
    }
  }
}

export default NetworkHandler;
