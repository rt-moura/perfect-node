import GameServer from "../../../app";
import IPacketHandler from "../../Interfaces/IPacketHandler";
import C2S_RoleList from "../C2S/C2S_RoleList";

class HandleRoleList implements IPacketHandler<C2S_RoleList> {
  public get name() {
    return C2S_RoleList.name;
  }

  public handlePacket(clientId: number, req: C2S_RoleList): void {
    // <PacketField Type="Dword" Name="Unk1" />
    // <PacketField Type="Dword" Name="NextSlotID" />
    // <PacketField Type="Dword" Name="AccountKey" />
    // <PacketField Type="Dword" Name="Unk3" />
    // <PacketField Type="Byte" Name="IsChar" />

    GameServer.networkHandler
      .getConnection(clientId)
      .send(Buffer.from([0x53, 0x11, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
  }
}

export default HandleRoleList;
