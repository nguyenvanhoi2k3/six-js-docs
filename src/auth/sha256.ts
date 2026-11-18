/**
 * SHA-256 viết tay (đồng bộ) — không dùng crypto.subtle vì API đó chỉ có trên HTTPS/localhost,
 * mở dev server qua IP mạng LAN sẽ không có.
 */
export function sha256(message: string): string {
  const frac = (x: number) => ((x - Math.floor(x)) * 0x100000000) | 0;
  const hash: number[] = [];
  const k: number[] = [];
  // Hằng số SHA-256 = phần lẻ của căn bậc 2 (8 số nguyên tố đầu) và căn bậc 3 (64 số nguyên tố đầu).
  for (let n = 2, found = 0; found < 64; n++) {
    let prime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        prime = false;
        break;
      }
    }
    if (!prime) continue;
    if (found < 8) hash[found] = frac(Math.sqrt(n));
    k[found++] = frac(Math.cbrt(n));
  }

  const bytes = Array.from(new TextEncoder().encode(message));
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (const word of [Math.floor(bitLength / 0x100000000), bitLength >>> 0]) {
    bytes.push((word >>> 24) & 255, (word >>> 16) & 255, (word >>> 8) & 255, word & 255);
  }

  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  for (let i = 0; i < bytes.length; i += 64) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++) {
      w[j] = (bytes[i + 4 * j] << 24) | (bytes[i + 4 * j + 1] << 16) | (bytes[i + 4 * j + 2] << 8) | bytes[i + 4 * j + 3];
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(w[j - 15], 7) ^ rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 = rotr(w[j - 2], 17) ^ rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;
    for (let j = 0; j < 64; j++) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + k[j] + w[j]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, h].forEach((v, idx) => (hash[idx] = (hash[idx] + v) | 0));
  }

  return hash.map((v) => (v >>> 0).toString(16).padStart(8, "0")).join("");
}
