import CryptoJS from "crypto-js";

interface Encoder {
  parse(encodedMessage: string): any;
  stringify(words: any): string;
}

interface WordArray {
  iv: string;
  salt: string;
  ciphertext: string;
  key?: string;
  toString(encoder?: Encoder): string;
}

export function arrayBufferToWordArray(ab: ArrayBuffer): WordArray {
  const i8a = new Uint8Array(ab);
  const a = [];
  for (let i = 0; i < i8a.length; i += 4) {
    a.push(
      (i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3]
    );
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
}
