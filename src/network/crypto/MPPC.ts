class MPPC {
  private BLOCK_SIZE = 0x2000;

  private readonly history: Uint8Array;
  private readonly hash: Uint8Array;
  private histoff: number;
  private legacy_in: number;

  constructor() {
    this.history = new Uint8Array(this.BLOCK_SIZE);
    this.hash = new Uint8Array(this.BLOCK_SIZE);
    this.histoff = 0;
    this.legacy_in = 0;
  }

  private blockCopy(src: Uint8Array, srcOffset: number, dst: Uint8Array, dstOffset: number, count: number): void {
    if (srcOffset < 0 || dstOffset < 0 || count < 0 || srcOffset + count > src.length || dstOffset + count > dst.length) {
      throw new RangeError("Invalid offsets or count");
    }

    for (let i = 0; i < count; i++) {
      dst[dstOffset + i] = src[srcOffset + i];
    }
  }

  private takeBytes(array: Uint8Array, count: number): Uint8Array {
    return array.slice(0, count);
  }

  public Compress(input: Uint8Array): Uint8Array {
    let ret: Uint8Array;
    if (input.length > 0 || this.legacy_in > 0) {
      ret = new Uint8Array(((9 * (this.legacy_in + input.length)) >> 3) + 6);
      let outbits: BitStream = this.Update(input, ret);
      this.CompressBlock(outbits, this.legacy_in);
      ret = this.takeBytes(ret, outbits.Offset >> 3);
    } else {
      ret = input;
    }
    return ret;
  }

  private Update(input: Uint8Array, output: Uint8Array): BitStream {
    let remain = this.BLOCK_SIZE - this.histoff - this.legacy_in;
    let isize = input.length;
    let ioffset = 0;
    let ostream: BitStream = new BitStream(output);
    if (isize >= remain) {
      this.blockCopy(input, 0, this.history, this.histoff + this.legacy_in, remain);
      isize -= remain;
      ioffset += remain;
      this.CompressBlock(ostream, remain + this.legacy_in);
      this.histoff = 0;
      while (isize >= this.BLOCK_SIZE) {
        this.blockCopy(input, ioffset, this.history, 0, this.BLOCK_SIZE);
        this.CompressBlock(ostream, this.BLOCK_SIZE);
        this.histoff = 0;
        isize -= this.BLOCK_SIZE;
        ioffset += this.BLOCK_SIZE;
      }
    }
    this.blockCopy(input, ioffset, this.history, this.histoff + this.legacy_in, isize);
    this.legacy_in += isize;
    return ostream;
  }

  private CompressBlock(stream: BitStream, size: number): void {
    let r = this.histoff + size;
    let s = this.histoff;
    while (r - s > 2) {
      let p = this.GetPredecitAddr(s);
      if (p < s) {
        if (this.history[p++] == this.history[s++] && this.history[p++] == this.history[s]) {
          if (this.history[p++] == this.history[++s]) {
            for (++s; s < r && this.history[p] == this.history[s]; ++s) ++p;
            let len = s - this.histoff;
            this.histoff = s;
            this.PutOff(stream, s - p);
            let val = 0,
              n = 1;
            if (len > 3) {
              let high = this.GetHighestBit(len);
              val = (len & ((1 << high) - 1)) | (((1 << (high - 1)) - 1) << (high + 1));
              n = high << 1;
            }
            this.PutBits(stream, val, n);
          } else {
            this.PutLit(stream, this.history[this.histoff++]);
            s = this.histoff;
          }
        } else {
          this.PutLit(stream, this.history[this.histoff++]);
        }
      } else {
        this.PutLit(stream, this.history[this.histoff++]);
        s = this.histoff;
      }
    }
    if (r - s == 1 || r - s == 2) {
      for (let i = 0; i < r - s; i++) this.PutLit(stream, this.history[this.histoff++]);
    }
    this.PutOff(stream, 0);
    stream.Pad();
    this.legacy_in = 0;
  }

  private PutBits(bits: BitStream, val: number, n: number): void {
    bits.WriteBits(val, n);
  }
  private PutLit(bits: BitStream, c: number): void {
    let newc = ((c & 0xffff) | ((c & 0x80) << 1)) & 0x17f;
    let n = 8 | ((c & 0x80) >> 7);
    this.PutBits(bits, newc, n);
  }
  private PutOff(bits: BitStream, off: number): void {
    let newoff = off | 0x3c0;
    let n = 0x0a;
    if (off > 0x3f) {
      if (off > 0x13f) {
        newoff = (off - 0x140) | 0xc000;
        n = 0x10;
      } else {
        newoff = (off - 0x40) | 0xe00;
        n = 0x0c;
      }
    }
    this.PutBits(bits, newoff, n);
  }
  private GetPredecitAddr(offset: number): number {
    let index = ((0x9e5f * (this.history[offset + 2] ^ (16 * (this.history[offset + 1] ^ (16 * this.history[offset]))))) >> 4) & 0x1fff;
    let ret = this.hash[index];
    this.hash[index] = offset;
    return ret;
  }

  private GetHighestBit(val: number): number {
    let ret = 31;
    while ((val & (1 << ret)) == 0) ret--;
    return ret;
  }
}

class BitStream {
  private readonly buffer: Uint8Array;
  public Offset: number;

  constructor(buf: Uint8Array) {
    this.buffer = buf;
    this.Offset = 0;
  }

  public WriteBits(val: number, n: number): void {
    let off = this.Offset & 7;
    let idx = this.Offset >> 3;
    let v = (val << (32 - n - off)) | (this.buffer[idx] << 24);
    for (let i = 0; i < 4; i++) this.buffer[idx + i] = (v >> (24 - (i << 3))) & 0xff;
    this.Offset += n;
  }
  public Pad(): void {
    let pad_length = (8 - (this.Offset & 7)) & 7;
    if (pad_length > 0) this.WriteBits(0, pad_length);
  }
}

export default MPPC;
