import GamePacket from "../GamePacket";
import GamePacketID from "../../Enums/GamePacketID";
import ByteStream from "../../ByteStream";

class C2S_LoginAnnounce extends GamePacket {
  public readonly ID = GamePacketID.C2S_LoginAnnounce;
  public username!: string;
  public passwordHash!: Buffer;

  protected readPacket(byteStream: ByteStream): void {
    const id = byteStream.readByte();
    const length = byteStream.readByte();
    const usernameLength = byteStream.readByte();
    this.username = byteStream.readBytes(usernameLength).toString();
    const hashLength = byteStream.readByte();
    this.passwordHash = byteStream.readBytes(hashLength);
  }

  protected writePacket(byteStream: ByteStream): void {
    byteStream.writeByte(this.ID);

    const buffer = new ByteStream();
    buffer.writeByte(this.username.length);
    buffer.writeBytes(this.username);
    buffer.writeByte(this.passwordHash.length);
    buffer.writeBytes(this.passwordHash);

    byteStream.writeByte(buffer.length);
    byteStream.writeBytes(buffer.readBytes());
  }
}

export default C2S_LoginAnnounce;
