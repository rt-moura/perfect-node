enum GamePacketID {
  S2C_ServerInfo = 0x01,
  C2S_LoginAnnounce = 0x02,
  S2C_SMKey = 0x03,
  C2S_CMKey = 0x03,
  C2S_KeepAlive = 0x5a,
}

export default GamePacketID;
