import { createHmac, Hmac } from "crypto";

class HMACMD5 {
  private _hmac: Hmac;

  constructor(key: string) {
    this._hmac = createHmac("md5", key);
  }

  public computeHash(data: Buffer) {
    this._hmac.update(data);

    return this._hmac.digest();
  }
}

export default HMACMD5;
