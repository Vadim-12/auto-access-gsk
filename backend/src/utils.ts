import { randomBytes } from 'node:crypto';

export function generateNumericCode(length: number): string {
  const codeArray = [];
  while (codeArray.length < length) {
    const byte = randomBytes(1)[0];
    if (byte < 250) {
      codeArray.push(byte % 10);
    }
  }
  return codeArray.join('');
}
