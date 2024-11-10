import GamePacketID from "../../Enums/GamePacketID";
import GamePacket from "../GamePacket";
import ByteStream from "../../ByteStream";

class C2S_CMKey extends GamePacket {
  public readonly ID = GamePacketID.C2S_CMKey;
  public key!: Buffer;
  public force!: number;

  protected readPacket(byteStream: ByteStream): void {
    const id = byteStream.readByte();
    const length = byteStream.readByte();
    const keyLength = byteStream.readByte();
    this.key = byteStream.readBytes(keyLength);
    this.force = byteStream.readByte();
  }

  protected writePacket(byteStream: ByteStream): void {
    byteStream.writeByte(this.ID);

    const buffer = new ByteStream();
    buffer.writeByte(this.key.length);
    buffer.writeBytes(this.key);
    buffer.writeByte(this.force);

    byteStream.writeByte(buffer.length);
    byteStream.writeBytes(buffer.readBytes());
  }
}

export default C2S_CMKey;
