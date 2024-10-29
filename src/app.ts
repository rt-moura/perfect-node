import net from "net";
import NetworkHandler from "./network/Handlers/NetworkHandler";
import config from "./config.json";

class GameServer {
  private static _instance: GameServer;
  private _tcpServer!: net.Server;
  private _port: number;
  private _networkHandler!: NetworkHandler;

  private constructor() {
    this._port = config.port;

    this.setupNetwork();
  }

  static getInstance() {
    if (this._instance) return this._instance;

    this._instance = new GameServer();
    return this._instance;
  }

  private setupNetwork() {
    this._tcpServer = net.createServer();
    this._networkHandler = new NetworkHandler(this._tcpServer);
    this._tcpServer.listen(this._port, () => console.log(`Server is listening on port: ${this._port}`));
  }
}

GameServer.getInstance();
