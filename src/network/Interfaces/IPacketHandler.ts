import GamePacket from "../Packets/GamePacket";

export default interface IPacketHandler<T extends GamePacket> {
  handlePacket(clientId: number, req: T): void;
}
