import GameServer from "../../../app";
import IPacketHandler from "../../Interfaces/IPacketHandler";
import C2S_LoginAnnounce from "../C2S/C2S_LoginAnnounce";
import S2C_SMKey from "../S2C/S2C_SMKey";

class HandleLoginAnnounce implements IPacketHandler<C2S_LoginAnnounce> {
  public get name() {
    return C2S_LoginAnnounce.name;
  }

  public handlePacket(clientId: number, req: C2S_LoginAnnounce): void {
    const SMKey = new S2C_SMKey();

    GameServer.networkHandler.getConnection(clientId).setClientDecryption(req.username, req.passwordHash, SMKey.key);
    GameServer.networkHandler.sendPacket(clientId, SMKey);
  }
}

export default HandleLoginAnnounce;
