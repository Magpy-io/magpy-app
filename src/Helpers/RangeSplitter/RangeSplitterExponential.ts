import { RangeSplitter } from './RangeSplitter';

export class RangeSplitterExponential implements RangeSplitter {
  startLength: number;
  maxLength: number;
  iterationsToReachMax: number;

  constructor(startLength: number, maxLength: number, iterationsToReachMax: number) {
    this.startLength = startLength;
    this.maxLength = maxLength;
    this.iterationsToReachMax = iterationsToReachMax;
  }

  splitRange(a: number, b?: number): { start: number; end: number }[] {
    if (b == null) {
      b = a;
      a = 0;
    }

    if (this.startLength <= 0) {
      throw new Error('Invalid segmentLength, must be positive integer > 0');
    }

    if (this.maxLength < this.startLength) {
      throw new Error(
        'Invalid maxLength, must be positive integer > 0 bigger than or equal to startLength',
      );
    }

    if (this.iterationsToReachMax <= 1) {
      throw new Error('Invalid segmentLength, must be positive integer > 1');
    }

    if (b - a <= this.startLength) {
      return [{ start: a, end: b }];
    }

    const ranges = [{ start: a, end: a + this.startLength }];

    const expFunction = (n: number) => {
      const B = Math.pow(
        this.maxLength / this.startLength,
        1 / (this.iterationsToReachMax - 1),
      );
      return Math.round(this.startLength * Math.pow(B, n));
    };

    let n = 1;
    let lastRangeEnd = ranges[ranges.length - 1].end;
    let rangesMaxedOut = false;

    while (lastRangeEnd != b) {
      const nextRangeLen = rangesMaxedOut ? this.maxLength : expFunction(n);

      if (nextRangeLen >= this.maxLength) {
        rangesMaxedOut = true;
      }

      const nextRangeEnd = lastRangeEnd + nextRangeLen > b ? b : lastRangeEnd + nextRangeLen;

      ranges.push({ start: lastRangeEnd, end: nextRangeEnd });

      lastRangeEnd = nextRangeEnd;
      n++;
    }

    return ranges;
  }
}
