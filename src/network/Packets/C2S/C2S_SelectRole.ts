import GamePacketID from "../../Enums/GamePacketID";
import GamePacket from "../GamePacket";
import ByteStream from "../../ByteStream";

class C2S_SelectRole extends GamePacket {
	public readonly ID = GamePacketID.C2S_SelectRole;
	public charUID!: number;

	protected readPacket(byteStream: ByteStream): void {
		const id = byteStream.readByte();
		const length = byteStream.readByte();
		this.charUID = byteStream.readInt();
	}

	protected writePacket(byteStream: ByteStream): void {
		byteStream.writeByte(this.ID);

		const buffer = new ByteStream();
		buffer.writeInt(this.charUID);

		byteStream.writeByte(buffer.length);
		byteStream.writeBytes(buffer.readBytes());
	}
}

export default C2S_SelectRole;
