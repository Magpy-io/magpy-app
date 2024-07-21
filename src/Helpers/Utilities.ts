/**
 * Clamps number between 0 and max
 *
 * @param {Number} val - value to clamp
 * @param {Number} max - Upper limit of clamping range
 *
 * @returns {Number} Returns the clamped value of val
 */
export function clamp(val: number, max: number): number {
  return val > max ? max : val < 0 ? 0 : val;
}

export function formatAddressHttp(ip: string, port: string) {
  return `http://${ip}:${port}`;
}

export function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function memoDebugger(a: any, b: any) {
  let equal = true;
  for (const p in a) {
    if (p in a) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(p, ':', a[p] === b[p]);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    equal = equal && a[p] == b[p];
  }
  console.log('props are same :', equal);
  return equal;
}
