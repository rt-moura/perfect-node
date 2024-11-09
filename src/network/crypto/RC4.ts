class RC4 {
  private S = new Uint8Array(256);

  private x = 0;
  private y = 0;

  constructor(key: Uint8Array) {
    this.init(key);
  }

  private init(key: Uint8Array) {
    const keyLen = key.length;

    for (let i = 0; i < 256; i++) {
      this.S[i] = i;
    }

    let j = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + this.S[i] + key[i % keyLen]) % 256;

      [this.S[i], this.S[j]] = [this.S[j], this.S[i]]; //swap
    }
  }

  public encode(dataB: Uint8Array) {
    const cipher = new Uint8Array(dataB.length);

    for (let m = 0; m < dataB.length; m++) {
      cipher[m] = dataB[m] ^ this.keyItem();
    }

    return cipher;
  }

  public decode(dataB: Uint8Array) {
    return this.encode(dataB);
  }

  private keyItem(): number {
    this.x = (this.x + 1) % 256;
    this.y = (this.y + this.S[this.x]) % 256;

    //swap
    [this.S[this.x], this.S[this.y]] = [this.S[this.y], this.S[this.x]];

    return this.S[(this.S[this.x] + this.S[this.y]) % 256];
  }
}

export default RC4;
