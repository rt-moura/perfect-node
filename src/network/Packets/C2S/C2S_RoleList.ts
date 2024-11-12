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
    this.userid = byteStream.readInt();
    this.unknown = byteStream.readInt();
    this.slot = byteStream.readInt();
  }

  protected writePacket(byteStream: ByteStream): void {
    byteStream.writeByte(this.ID);

    const buffer = new ByteStream();
    buffer.writeInt(this.userid);
    buffer.writeInt(this.unknown);
    buffer.writeInt(this.slot);

    byteStream.writeByte(buffer.length);
    byteStream.writeBytes(buffer.readBytes());
  }
}

export default C2S_RoleList;
