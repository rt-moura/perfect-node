import { Socket } from "net";

function packetHandler(data: Buffer) {
  console.log(data);
}

export default packetHandler;
