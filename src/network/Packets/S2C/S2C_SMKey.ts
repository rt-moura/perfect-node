import GamePacketID from "../../Enums/GamePacketID";
import GamePacket from "../GamePacket";
import ByteStream from "../../ByteStream";

class S2C_SMKey extends GamePacket {
  public readonly ID = GamePacketID.S2C_SMKey;
  public key: Buffer;
  public force: number;

  constructor(keyLen: number = 16, force: boolean = false) {
    super();

    const _key = new ByteStream();
    for (let i = 0; i < keyLen; i++) {
      _key.writeByte(Math.floor(Math.random() * 256));
    }

    this.key = Buffer.from(_key.readBytes());
    this.force = Number(force);
  }

  protected readPacket(byteStream: ByteStream): void {}

  protected writePacket(byteStream: ByteStream): void {
    const buffer = new ByteStream();
    buffer.writeByte(this.key.length);
    buffer.writeBytes(this.key);
    buffer.writeByte(this.force);

    byteStream.writeByte(this.ID);
    byteStream.writeByte(buffer.length);
    byteStream.writeBytes(buffer.readBytes());
  }
}

export default S2C_SMKey;
