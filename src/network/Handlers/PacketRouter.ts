import GamePacket from "../Packets/GamePacket";
import IPacketHandler from "../Interfaces/IPacketHandler";

class PacketRouter {
  private readonly _handlers: Map<any, IPacketHandler<GamePacket>> = new Map();

  public Register<T extends GamePacket>(handler: IPacketHandler<T>) {
    if (handler == null) {
      console.log(`Handler for ${handler} is null`);
      return;
    }

    this._handlers.set(typeof handler, handler);
  }

  public onMessage<T extends GamePacket>(clientId: number, req: T) {
    const handler = this._handlers.get(typeof req);

    if (handler) {
      handler.handlePacket(clientId, req);
    } else {
      console.log(`No handler found for packet type ${req.constructor.name}`);
    }
  }
}

export default PacketRouter;
