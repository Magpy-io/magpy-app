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
