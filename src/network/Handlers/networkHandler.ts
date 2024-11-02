import { Server, Socket } from "net";
import Connection from "./ConnectionHandler";
import PacketRouter from "./PacketRouter";

import HandleLoginAnnounce from "../Packets/PacketHandlers/HandleLoginAnnounce";

class NetworkHandler {
  private _server: Server;
  private _peers: Connection[] = [];
  private _requestHandler: PacketRouter;

  constructor(tcpServer: Server) {
    this._server = tcpServer;

    this._server.on("error", this.handleServerError);
    this._server.on("connection", this.handleConnection.bind(this));

    this._requestHandler = new PacketRouter();

    this.initializePacketHandlers();
  }

  private initializePacketHandlers() {
    this._requestHandler.Register(new HandleLoginAnnounce());
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
    this._peers.push(new Connection(clientId, clientSocket, filteredPeers, this._requestHandler));
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
