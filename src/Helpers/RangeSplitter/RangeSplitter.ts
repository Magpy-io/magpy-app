export interface RangeSplitter {
  splitRange(n: number): { start: number; end: number }[];
  splitRange(a: number, b: number): { start: number; end: number }[];
}
