import { RangeSplitter } from './RangeSplitter';

export class RangeSplitterLinear implements RangeSplitter {
  segmentLength: number;

  constructor(segmentLength: number) {
    this.segmentLength = segmentLength;
  }

  splitRange(a: number, b?: number): { start: number; end: number }[] {
    if (b == null) {
      b = a;
      a = 0;
    }

    if (this.segmentLength <= 0) {
      throw new Error('Invalid segmentLength, must be positive integer > 0');
    }

    const perfectSplit = (b - a) % this.segmentLength == 0;

    const numberOfFullRanges = Math.floor((b - a) / this.segmentLength);

    const ranges: { start: number; end: number }[] = [];

    for (let i = 0; i < numberOfFullRanges; i++) {
      ranges.push({
        start: i * this.segmentLength + a,
        end: (i + 1) * this.segmentLength + a,
      });
    }

    if (!perfectSplit) {
      ranges.push({ start: numberOfFullRanges * this.segmentLength + a, end: b });
    }
    return ranges;
  }
}
