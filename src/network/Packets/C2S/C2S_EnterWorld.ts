import GamePacketID from "../../Enums/GamePacketID";
import GamePacket from "../GamePacket";
import ByteStream from "../../ByteStream";

class C2S_EnterWorld extends GamePacket {
	public readonly ID = GamePacketID.C2S_EnterWorld;
	public charUID!: number;
	public provider_link_id!: number;
	public localsid!: number;

	protected readPacket(byteStream: ByteStream): void {
		const id = byteStream.readByte();
		const length = byteStream.readByte();
		this.charUID = byteStream.readInt();
		this.provider_link_id = byteStream.readInt();
		this.localsid = byteStream.readInt();
	}

	protected writePacket(byteStream: ByteStream): void {
		byteStream.writeByte(this.ID);

		const buffer = new ByteStream();
		buffer.writeInt(this.charUID);
		buffer.writeInt(this.provider_link_id);
		buffer.writeInt(this.localsid);

		byteStream.writeByte(buffer.length);
		byteStream.writeBytes(buffer.readBytes());
	}
}

export default C2S_EnterWorld;
