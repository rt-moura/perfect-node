import GamePacketID from "../../Enums/GamePacketID";
import GamePacket from "../GamePacket";
import ByteStream from "../../ByteStream";

class S2C_OnlineAnnounce extends GamePacket {
  public readonly ID = GamePacketID.S2C_OnlineAnnounce;
  private length = 25;
  public userid!: number;
  public localsid!: number;
  public remainTime!: number;
  public zoneid!: number;
  public freeTimeLeft!: number;
  public freeTimeEnd!: number;
  public createTime!: number;

  constructor(userId: number, localsId: number, remainTime: number, zoneId: number, freeTimeLeft: number, freeTimeEnd: number, createTime: number) {
    super();

    this.userid = userId;
    this.localsid = localsId;
    this.remainTime = remainTime;
    this.zoneid = zoneId;
    this.freeTimeLeft = freeTimeLeft;
    this.freeTimeEnd = freeTimeEnd;
    this.createTime = createTime;
  }

  protected readPacket(byteStream: ByteStream): void {}

  protected writePacket(byteStream: ByteStream): void {
    byteStream.writeByte(this.ID);

    const buffer = new ByteStream();
    buffer.writeInt(this.userid);
    buffer.writeInt(this.localsid);
    buffer.writeInt(this.remainTime);
    buffer.writeByte(this.zoneid);
    buffer.writeInt(this.freeTimeLeft);
    buffer.writeInt(this.freeTimeEnd);
    buffer.writeInt(this.createTime);

    byteStream.writeByte(buffer.length);
    byteStream.writeBytes(buffer.readBytes());
  }
}

export default S2C_OnlineAnnounce;
