import { Socket } from "net";
import GamePacket from "../Packets/GamePacket";
import GamePacketList from "../Packets/GamePacketList";
import S2C_ServerInfo from "../Packets/S2C/S2C_ServerInfo";
import PacketRouter from "./PacketRouter";

class Connection {
  private readonly _clientId: number;
  private readonly _socket: Socket;
  private readonly _peers: Connection[];
  private readonly _requestHandler: PacketRouter;
  private _isCompressed = false;
  private _isEncrypted = false;

  constructor(clientId: number, socket: Socket, peers: Connection[], requestHandler: PacketRouter) {
    this._clientId = clientId;
    this._socket = socket;
    this._peers = peers;
    this._requestHandler = requestHandler;

    this._socket.on("data", this.handlePacket.bind(this));

    //Hand Shake between client and server
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
    const packet: GamePacket = GamePacket.from(data, GamePacketList);

    console.log("RECEIVING", packet);
    this._requestHandler.onMessage(this._clientId, packet);
  }
}

export default Connection;
