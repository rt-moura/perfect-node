import GameServer from "../../../app";
import IPacketHandler from "../../Interfaces/IPacketHandler";
import C2S_LoginAnnounce from "../C2S/C2S_LoginAnnounce";

class HandleLoginAnnounce implements IPacketHandler<C2S_LoginAnnounce> {
  public get name() {
    return C2S_LoginAnnounce.name;
  }

  public handlePacket(clientId: number, req: C2S_LoginAnnounce): void {
    console.log("LoginAnnounce received");
    const connection = GameServer._networkHandler.getConnection(clientId);

    connection?.send(
      Buffer.from([0x03, 0x12, 0x10, 0x7d, 0xc1, 0xdb, 0x56, 0x4d, 0x46, 0xa4, 0x1a, 0xa5, 0xa7, 0x26, 0x9b, 0x30, 0x82, 0x9e, 0x07, 0x00])
    );
  }
}

export default HandleLoginAnnounce;
