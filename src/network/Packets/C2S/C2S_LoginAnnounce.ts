import GamePacket from "../GamePacket";
import GamePacketID from "../../Enums/GamePacketID";
import ByteStream from "../../ByteStream";

class C2S_LoginAnnounce extends GamePacket {
  public readonly ID = GamePacketID.C2S_LoginAnnounce;
  public login!: string;
  public passwordHash!: Buffer;

  protected readPacket(byteStream: ByteStream): void {
    const id = byteStream.readByte();
    const length = byteStream.readByte();
    const loginLength = byteStream.readByte();
    this.login = byteStream.readBytes(loginLength).toString();
    const hashLength = byteStream.readByte();
    this.passwordHash = byteStream.readBytes(hashLength);
  }

  protected writePacket(byteStream: ByteStream): void {
    byteStream.writeByte(this.ID);

    const buffer = new ByteStream();
    buffer.writeByte(this.login.length);
    buffer.writeBytes(this.login);
    buffer.writeByte(this.passwordHash.length);
    buffer.writeBytes(this.passwordHash);

    byteStream.writeByte(buffer.length);
    byteStream.writeBytes(buffer.readBytes());
  }
}

export default C2S_LoginAnnounce;
