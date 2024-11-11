import GamePacketID from "../../Enums/GamePacketID";
import GamePacket from "../GamePacket";
import ByteStream from "../../ByteStream";

class C2S_KeepAlive extends GamePacket {
  public readonly ID = GamePacketID.C2S_KeepAlive;
  public code!: number;

  protected readPacket(byteStream: ByteStream): void {
    const id = byteStream.readByte();
    const length = byteStream.readByte();
    this.code = byteStream.readByte();
  }

  protected writePacket(byteStream: ByteStream): void {
    byteStream.writeByte(this.ID);
    byteStream.writeByte(0x01);
    byteStream.writeByte(this.ID);
  }
}

export default C2S_KeepAlive;
