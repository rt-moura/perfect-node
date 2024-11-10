import C2S_CMKey from "./C2S/C2S_CMKey";
import C2S_LoginAnnounce from "./C2S/C2S_LoginAnnounce";
import GamePacket from "./GamePacket";

const packetList: GamePacket[] = [new C2S_LoginAnnounce(), new C2S_CMKey()];

export default packetList;
