import GamePacketID from "../../Enums/GamePacketID";
import GamePacket from "../GamePacket";
import ByteStream from "../../ByteStream";

type serverVersionArr = [number, number, number, number];

class S2C_ServerInfo extends GamePacket {
  public readonly ID = GamePacketID.S2C_ServerInfo;
  public serverLoad: number;
  private unkPing1: number = 0x00;
  private unkPing2: number = 0x00;
  public serverFlags: number;
  private _unknownBytes = [0x00, 0x00, 0x00, 0x00, 0xc2, 0xfe, 0xa5, 0x73, 0xbf, 0x6f, 0x80, 0xd7];
  private serverVersion: serverVersionArr = [0x00, 0x01, 0x02, 0x06];
  private bonus: number = 0xff;

  constructor(serverLoad: number, serverFlags: number) {
    super();
    this.serverLoad = serverLoad;
    this.serverFlags = serverFlags;
  }
  protected readPacket(byteStream: ByteStream) {}

  protected writePacket(byteStream: ByteStream) {
    const key = new ByteStream();
    key.writeByte(this.serverLoad);
    key.writeByte(this.unkPing1);
    key.writeByte(this.unkPing2);
    key.writeByte(this.serverFlags);
    key.writeBytes(this._unknownBytes);

    const buffer = new ByteStream();
    buffer.writeByte(key.length);
    buffer.writeBytes(key.readBytes());
    buffer.writeBytes(this.serverVersion);
    buffer.writeByte(this.bonus);

    byteStream.writeByte(this.ID);
    byteStream.writeByte(buffer.length);
    byteStream.writeBytes(buffer.readBytes());
  }
}

export default S2C_ServerInfo;
