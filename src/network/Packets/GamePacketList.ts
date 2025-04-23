import C2S_CMKey from "./C2S/C2S_CMKey";
import C2S_EnterWorld from "./C2S/C2S_EnterWorld";
import C2S_KeepAlive from "./C2S/C2S_KeepAlive";
import C2S_LoginAnnounce from "./C2S/C2S_LoginAnnounce";
import C2S_RoleList from "./C2S/C2S_RoleList";
import C2S_SelectRole from "./C2S/C2S_SelectRole";
import C2S_WorldRequest from "./C2S/C2S_WorldRequest";
import GamePacket from "./GamePacket";

const packetList: GamePacket[] = [
	new C2S_LoginAnnounce(),
	new C2S_CMKey(),
	new C2S_KeepAlive(),
	new C2S_RoleList(),
	new C2S_SelectRole(),
	new C2S_EnterWorld(),
	new C2S_WorldRequest(),
];

export default packetList;
