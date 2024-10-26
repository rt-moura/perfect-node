import net from "net";
import networkHandler from "./network/Handlers/networkHandler";
import config from "./config.json";

const server = net.createServer(networkHandler);

server.on("error", (error) => console.log(`Server socket error: ${error.message}`));
server.listen(config.port, () => {
  console.log(`Server is listening on port: ${config.port}`);
});
