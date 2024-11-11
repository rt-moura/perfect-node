import IPacketHandler from "../../Interfaces/IPacketHandler";
import C2S_KeepAlive from "../C2S/C2S_KeepAlive";

class HandleKeepAlive implements IPacketHandler<C2S_KeepAlive> {
  public get name() {
    return C2S_KeepAlive.name;
  }

  public handlePacket(clientId: number, req: C2S_KeepAlive): void {}
}

export default HandleKeepAlive;
