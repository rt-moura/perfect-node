import GamePacketID from "../Enums/GamePacketID";
import ByteStream, { ByteArray } from "../ByteStream";

abstract class GamePacket {
  public abstract readonly ID: GamePacketID;

  protected abstract readPacket(byteStream: ByteStream): void;

  private Read(data: Buffer): void {
    const byteStream = new ByteStream(data);
    this.readPacket(byteStream);
  }

  private static construct(data: Buffer, gamePacketList: GamePacket[]): GamePacket {
    if (!data.length) throw new Error("Empty packet can't be created");
    const packetID = data[0] as GamePacketID;

    for (const packet of gamePacketList) {
      if (packet.ID == packetID) return packet;
    }

    return new UnknownPacket();
  }

  //hack fix to avoid circular dependecy on gamePacketList
  public static from(data: ByteArray, gamePacketList: GamePacket[]): GamePacket {
    const _data = Buffer.from(data);
    const result = this.construct(_data, gamePacketList);
    result.Read(_data);

    return result;
  }

  protected abstract writePacket(byteStream: ByteStream): void;

  public getBytes(): Buffer {
    const byteStream = new ByteStream();
    this.writePacket(byteStream);
    return byteStream.readBytes();
  }
}

class UnknownPacket extends GamePacket {
  public ID!: GamePacketID;
  public length!: number;
  public buffer!: Uint8Array;

  protected readPacket(byteStream: ByteStream) {
    this.ID = byteStream.readByte();
    this.length = byteStream.readByte();
    this.buffer = new Uint8Array(byteStream.readBytes());
  }

  protected writePacket(byteStream: ByteStream) {
    byteStream.writeByte(this.ID);
    byteStream.writeByte(this.length);
    byteStream.writeBytes(this.buffer);
  }
}

export default GamePacket;
