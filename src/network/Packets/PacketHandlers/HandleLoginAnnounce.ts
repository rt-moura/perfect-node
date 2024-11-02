import IPacketHandler from "../../Interfaces/IPacketHandler";
import C2S_LoginAnnounce from "../C2S/C2S_LoginAnnounce";

class HandleLoginAnnounce implements IPacketHandler<C2S_LoginAnnounce> {
  public handlePacket(clientId: number, req: C2S_LoginAnnounce): void {
    console.log("LoginAnnounce received");
  }
}

export default HandleLoginAnnounce;
