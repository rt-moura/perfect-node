import net from "net";
import NetworkHandler from "./network/Handlers/NetworkHandler";
import config from "./config.json";

class GameServer {
  private _tcpServer!: net.Server;
  private _port: number;
  public static _networkHandler: NetworkHandler;

  constructor() {
    this._port = config.port;

    this.setupNetwork();
  }

  private setupNetwork() {
    this._tcpServer = net.createServer();
    GameServer._networkHandler = new NetworkHandler(this._tcpServer);
    this._tcpServer.listen(this._port, () => console.log(`Server is listening on port: ${this._port}`));
  }
}

new GameServer();

export default GameServer;
