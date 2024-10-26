import { Socket } from "net";
import packetHandler from "./packetHandler";

function HandShake(socket: Socket) {
  const data: Buffer = Buffer.from([1, 2, 3]);
  socket.write(data);
}

function networkHandler(socket: Socket) {
  console.log(`New connection from address: ${socket.remoteAddress}`);

  HandShake(socket);

  socket.on("data", packetHandler);
  socket.on("end", () => console.log(`Connection lost from address: ${socket.remoteAddress}`));
  socket.on("error", (error) => console.log(`Client socket error: ${error.message}`));
}

export default networkHandler;
