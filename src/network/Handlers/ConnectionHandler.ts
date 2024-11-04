import { Socket } from "net";
import GamePacket from "../Packets/GamePacket";
import GamePacketList from "../Packets/GamePacketList";
import S2C_ServerInfo from "../Packets/S2C/S2C_ServerInfo";

type packetHandlerType = (clientId: number, packet: GamePacket) => void;

class Connection {
  private readonly _clientId: number;
  private readonly _socket: Socket;
  private readonly _packetHandlerCllbk: packetHandlerType;
  private _isCompressed = false;
  private _isEncrypted = false;

  constructor(clientId: number, socket: Socket, handlePacketCllbk: packetHandlerType) {
    this._clientId = clientId;
    this._socket = socket;
    this._packetHandlerCllbk = handlePacketCllbk;

    this._socket.on("data", this.handlePacket.bind(this));
  }

  public get clientId() {
    return this._clientId;
  }

  public send(data: Buffer) {
    this._socket.write(data);
  }

  private handlePacket(data: Buffer) {
    const packet = GamePacket.from(data, GamePacketList);

    this._packetHandlerCllbk(this._clientId, packet);
  }
}

export default Connection;
