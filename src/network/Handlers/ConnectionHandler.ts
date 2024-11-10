import { Socket } from "net";
import GamePacket from "../Packets/GamePacket";
import GamePacketList from "../Packets/GamePacketList";
import RC4 from "../crypto/RC4";
import MPPC from "../crypto/MPPC";
import HMACMD5 from "../crypto/HMACMD5";

type packetHandlerType = (clientId: number, packet: GamePacket) => void;

class Connection {
  private readonly _clientId: number;
  private readonly _socket: Socket;
  private readonly _packetHandlerCllbk: packetHandlerType;
  private _serverEncryption!: RC4;
  private _clientEncryption!: RC4;
  private _compressor!: MPPC;
  private _username!: string;
  private _passwordHash!: Buffer;
  private _isServerEncrypted = false;
  private _isClientEncrypted = false;

  constructor(clientId: number, socket: Socket, handlePacketCllbk: packetHandlerType) {
    this._clientId = clientId;
    this._socket = socket;
    this._packetHandlerCllbk = handlePacketCllbk;

    this._socket.on("data", this.handlePacket.bind(this));
  }

  public get clientId() {
    return this._clientId;
  }

  public setClientDecryption(username: string, passwordHash: Buffer, smKey: Buffer) {
    if (this._isClientEncrypted) throw new SyntaxError("Client encryption has already been defined");

    this._username = username;
    this._passwordHash = passwordHash;

    const hmacmd5 = new HMACMD5(this._username);
    const hmacData = Buffer.concat([this._passwordHash, smKey]);
    const RC4_ClientKey = hmacmd5.computeHash(hmacData);

    this._clientEncryption = new RC4(RC4_ClientKey);
    this._isClientEncrypted = true;
  }

  public setServerEncryption(cmKey: Buffer) {
    if (!this._isClientEncrypted) throw new SyntaxError("Client encryption must be set first");

    const hmacmd5 = new HMACMD5(this._username);
    const hmacData = Buffer.concat([this._passwordHash, cmKey]);
    const RC4_ServerKey = hmacmd5.computeHash(hmacData);

    this._serverEncryption = new RC4(RC4_ServerKey);
    this._compressor = new MPPC();
    this._isServerEncrypted = true;
  }

  public send(data: Buffer) {
    let _data = data;

    if (this._isServerEncrypted) {
      _data = Buffer.from(this._compressor.Compress(_data));
      _data = Buffer.from(this._serverEncryption.encode(_data));
    }

    this._socket.write(_data);
  }

  private handlePacket(data: Buffer) {
    let _data = data;

    if (this._isClientEncrypted) {
      _data = Buffer.from(this._clientEncryption.decode(_data));
    }

    const packet = GamePacket.from(_data, GamePacketList);
    this._packetHandlerCllbk(this._clientId, packet);
  }
}

export default Connection;
