import GameServer from "../../../app";
import IPacketHandler from "../../Interfaces/IPacketHandler";
import C2S_CMKey from "../C2S/C2S_CMKey";

class HandleCMKey implements IPacketHandler<C2S_CMKey> {
  public get name() {
    return C2S_CMKey.name;
  }

  public handlePacket(clientId: number, req: C2S_CMKey): void {
    GameServer.networkHandler.getConnection(clientId).setServerEncryption(req.key);
  }
}

export default HandleCMKey;
