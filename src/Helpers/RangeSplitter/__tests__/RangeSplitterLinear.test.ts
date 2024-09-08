import { RangeSplitterLinear } from '../RangeSplitterLinear';

describe('Tests for RangeSplitterLinear class', () => {
  test(`RangeSplitterLinear.split(10) should return 2 correct ranges when using a segment length of 5`, () => {
    const rangeSplitter = new RangeSplitterLinear(5);

    const ret = rangeSplitter.splitRange(10);
    expect(ret.length).toBe(2);

    const range1 = ret[0];
    const range2 = ret[1];

    expect(range1.start).toBe(0);
    expect(range1.end).toBe(5);

    expect(range2.start).toBe(5);
    expect(range2.end).toBe(10);
  });

  test(`RangeSplitterLinear.split(10) should return 4 correct ranges when using a segment length of 3`, () => {
    const rangeSplitter = new RangeSplitterLinear(3);

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

  test(`RangeSplitterLinear.split(1, 10) should return 3 correct ranges when using a segment length of 3`, () => {
    const rangeSplitter = new RangeSplitterLinear(3);

    const ret = rangeSplitter.splitRange(1, 10);
    expect(ret.length).toBe(3);

    const range1 = ret[0];
    const range2 = ret[1];
    const range3 = ret[2];

    expect(range1.start).toBe(1);
    expect(range1.end).toBe(4);

    expect(range2.start).toBe(4);
    expect(range2.end).toBe(7);

    expect(range3.start).toBe(7);
    expect(range3.end).toBe(10);
  });
});
