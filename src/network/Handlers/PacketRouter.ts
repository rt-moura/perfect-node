import GamePacket from "../Packets/GamePacket";
import IPacketHandler from "../Interfaces/IPacketHandler";

class PacketRouter {
  private readonly _handlers: Map<any, IPacketHandler<GamePacket>> = new Map();

  public Register<T extends GamePacket>(handler: IPacketHandler<T>) {
    if (handler == null) {
      console.log(`Handler for ${handler} is null`);
      return;
    }

    this._handlers.set(handler.name, handler);
  }

  public onMessage<T extends GamePacket>(clientId: number, req: T) {
    const packetName = req.constructor.name;
    const handler = this._handlers.get(packetName);

    if (handler) {
      handler.handlePacket(clientId, req);
    } else {
      console.log(`No handler found for ${packetName} (ID: 0x${req.ID.toString(16).toUpperCase()})`);
    }
  }
}

export default PacketRouter;
