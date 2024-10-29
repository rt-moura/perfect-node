import GamePacketID from "../../Enums/GamePacketID";
import GamePacket from "../GamePacket";
import ByteStream from "../../ByteStream";

class S2C_ServerInfo extends GamePacket {
  public readonly ID = GamePacketID.S2C_ServerInfo;
  private _data!: Buffer;

  protected readPacket(byteStream: ByteStream) {
    this._data = byteStream.readBytes();
  }

  protected writePacket(byteStream: ByteStream) {
    byteStream.writeBytes(this._data);
  }
}

export default S2C_ServerInfo;
