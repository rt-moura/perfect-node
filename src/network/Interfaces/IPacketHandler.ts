import GamePacket from "../Packets/GamePacket";

export default interface IPacketHandler<T extends GamePacket> {
  get name(): string;
  handlePacket(clientId: number, req: T): void;
}
