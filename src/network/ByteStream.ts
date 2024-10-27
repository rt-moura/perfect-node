type ByteArray = Buffer | Uint8Array | number[] | string;

class ByteStream {
  private _data: Buffer;

  constructor(buffer?: ByteArray) {
    this._data = Buffer.from(buffer ? buffer : []);
  }

  public get length(): number {
    return this._data.length;
  }

  public readByte(): number {
    const byte = this._data.readUint8();
    this._data = this._data.subarray(1);

    return byte;
  }

  public readBytes(count?: number): Buffer {
    if (count) {
      if (count > this._data.length) throw new RangeError("Attempt to access memory outside buffer bounds");
      if (count < 1) return Buffer.from([]);

      const bytes = this._data.subarray(0, count);
      this._data = this._data.subarray(count);

      return bytes;
    } else {
      const bytes = this._data.subarray();
      this._data = this._data.subarray(bytes.length);

      return bytes;
    }
  }

  public writeByte(value: number): void {
    value = value & 0xff;

    const tmpBuffer = Buffer.from([value]);
    this._data = Buffer.concat([this._data, tmpBuffer], this._data.length + 1);
  }

  public writeBytes(buffer: ByteArray): void {
    const tmpBuffer = Buffer.from(buffer);
    const totalLength = tmpBuffer.length + this._data.length;
    this._data = Buffer.concat([this._data, tmpBuffer], totalLength);
  }
}

export default ByteStream;
