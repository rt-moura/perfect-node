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

    //@TODO: use ByteStream.WriteInt instead this is very tricky
    const buffer = Buffer.allocUnsafe(this.length);
    buffer.writeInt32BE(this.userid);
    buffer.writeInt32BE(this.localsid, 4);
    buffer.writeInt32BE(this.remainTime, 8);
    buffer.writeUint8(this.zoneid, 12);
    buffer.writeInt32BE(this.freeTimeLeft, 13);
    buffer.writeInt32BE(this.freeTimeEnd, 17);
    buffer.writeInt32BE(this.createTime, 21);

    byteStream.writeByte(buffer.length);
    byteStream.writeBytes(buffer);
  }
}

export default S2C_OnlineAnnounce;
