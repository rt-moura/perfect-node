import GamePacketID from "../../Enums/GamePacketID";
import GamePacket from "../GamePacket";
import ByteStream from "../../ByteStream";

class C2S_RoleList extends GamePacket {
  public readonly ID = GamePacketID.C2S_RoleList;
  public userid!: number;
  public unknown!: number;
  public slot!: number;

  protected readPacket(byteStream: ByteStream): void {
    const id = byteStream.readByte();
    const length = byteStream.readByte();
    this.userid = byteStream.readBytes(4).readInt32BE();
    this.unknown = byteStream.readBytes(4).readInt32BE();
    this.slot = byteStream.readBytes(4).readInt32BE();
  }

  protected writePacket(byteStream: ByteStream): void {
    byteStream.writeByte(this.ID);

    const buffer = Buffer.allocUnsafe(12);
    buffer.writeInt32BE(this.userid);
    buffer.writeInt32BE(this.unknown, 4);
    buffer.writeInt32BE(this.slot, 8);

    byteStream.writeByte(buffer.length);
    byteStream.writeBytes(buffer);
  }
}

export default C2S_RoleList;
