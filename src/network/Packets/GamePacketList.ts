import C2S_CMKey from "./C2S/C2S_CMKey";
import C2S_KeepAlive from "./C2S/C2S_KeepAlive";
import C2S_LoginAnnounce from "./C2S/C2S_LoginAnnounce";
import C2S_RoleList from "./C2S/C2S_RoleList";
import GamePacket from "./GamePacket";

const packetList: GamePacket[] = [new C2S_LoginAnnounce(), new C2S_CMKey(), new C2S_KeepAlive(), new C2S_RoleList()];

export default packetList;
