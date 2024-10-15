import { RangeSplitterExponential } from '../RangeSplitterExponential';

describe('Tests for RangeSplitterExponential class', () => {
  test(`new RangeSplitterExponential(2, 10, 3).split(20) should return ranges : [0-2], [2:6], [6:16], [16:20]. Lengths of the ranges are 2,4,10,4`, () => {
    const rangeSplitter = new RangeSplitterExponential(2, 10, 3);

    const ranges = rangeSplitter.splitRange(20);

    testRangesStartAndEndAreCorrect({ a: 0, b: 20, rangeSplitter, ranges });
  });

  const testDataInput: {
    startLength: number;
    maxLength: number;
    iterationsToReachMax: number;
    n: number;
    expected: number[];
  }[] = [
    {
      startLength: 1,
      maxLength: 10,
      iterationsToReachMax: 3,
      n: 30,
      expected: [1, 3, 10, 10, 6],
    },

    {
      startLength: 10,
      maxLength: 100,
      iterationsToReachMax: 5,
      n: 500,
      expected: [10, 18, 32, 56, 100, 100, 100, 84],
    },
  ];

  test.each(testDataInput)(
    `new RangeSplitterExponential($startLength, $maxLength, $iterationsToReachMax).split($n) should return ranges with lengths of $expected`,
    ({ startLength, maxLength, iterationsToReachMax, n, expected }) => {
      const rangeSplitter = new RangeSplitterExponential(
        startLength,
        maxLength,
        iterationsToReachMax,
      );

      const ranges = rangeSplitter.splitRange(n);

      expect(ranges.map(r => r.end - r.start)).toEqual(expected);

      testRangesStartAndEndAreCorrect({ a: 0, b: n, rangeSplitter, ranges });
    },
  );

  test(`RangeSplitterExponential.split(10) should behave like linear when startLength and maxLength are equal`, () => {
    const rangeSplitter = new RangeSplitterExponential(3, 3, 2);

    const ret = rangeSplitter.splitRange(10);
    expect(ret.length).toBe(4);

    const range1 = ret[0];
    const range2 = ret[1];
    const range3 = ret[2];
    const range4 = ret[3];

    expect(range1.start).toBe(0);
    expect(range1.end).toBe(3);

    expect(range2.start).toBe(3);
    expect(range2.end).toBe(6);

    expect(range3.start).toBe(6);
    expect(range3.end).toBe(9);

    expect(range4.start).toBe(9);
    expect(range4.end).toBe(10);
  });
});

test(`RangeSplitterExponential.split(0) should return 1 range of length 0`, () => {
  const rangeSplitter = new RangeSplitterExponential(5, 5, 3);

  const ret = rangeSplitter.splitRange(0);
  expect(ret.length).toBe(1);

  const range = ret[0];

  expect(range.start).toBe(0);
  expect(range.end).toBe(0);
});

function testRangesStartAndEndAreCorrect({
  a,
  b,
  rangeSplitter,
  ranges,
}: {
  a: number;
  b: number;
  rangeSplitter: RangeSplitterExponential;
  ranges: { start: number; end: number }[];
}) {
  expect(ranges[0].start).toBe(a);
  expect(ranges[ranges.length - 1].end).toBe(b);

  for (let i = 0; i < ranges.length - 1; i++) {
    const rangeLen = ranges[i].end - ranges[i].start;

    if (i == 0) {
      expect(rangeLen).toBe(rangeSplitter.startLength);
    }

    if (i < rangeSplitter.iterationsToReachMax) {
      expect(rangeLen).toBeLessThanOrEqual(rangeSplitter.maxLength);
    } else {
      expect(rangeLen).toBe(rangeSplitter.maxLength);
    }
    expect(ranges[i].end).toBe(ranges[i + 1].start);
  }
}
