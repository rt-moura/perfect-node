enum GamePacketID {
  S2C_ServerInfo = 0x01,
  C2S_LoginAnnounce = 0x02,
  S2C_SMKey = 0x03,
  C2S_CMKey = 0x03,
  S2C_OnlineAnnounce = 0x04,
  C2S_KeepAlive = 0x5a,
  C2S_RoleList = 0x52,
}

export default GamePacketID;
