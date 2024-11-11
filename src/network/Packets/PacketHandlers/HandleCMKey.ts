import GameServer from "../../../app";
import IPacketHandler from "../../Interfaces/IPacketHandler";
import C2S_CMKey from "../C2S/C2S_CMKey";
import S2C_OnlineAnnounce from "../S2C/S2C_OnlineAnnounce";

class HandleCMKey implements IPacketHandler<C2S_CMKey> {
  public get name() {
    return C2S_CMKey.name;
  }

  public handlePacket(clientId: number, req: C2S_CMKey): void {
    const onlineAnnounce = new S2C_OnlineAnnounce(1024, 20, 0, 1, 0, -1, 0);

    GameServer.networkHandler.getConnection(clientId).setServerEncryption(req.key);
    GameServer.networkHandler.sendPacket(clientId, onlineAnnounce);
  }
}

export default HandleCMKey;
