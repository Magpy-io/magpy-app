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
