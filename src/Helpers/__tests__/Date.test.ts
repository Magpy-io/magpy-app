import { areDatesTheSameDay, withoutTime } from '../Date';

describe('Tests for areDatesTheSameDay function', () => {
  it('Should return true if same date', () => {
    const d1 = '2023-06-22T14:43:51.880Z';
    const d2 = '2023-06-22T14:48:40.880Z';
    const ret = areDatesTheSameDay(d1, d2);
    expect(ret).toBe(true);
  });

  it('Should return false if not same date', () => {
    const d1 = '2023-06-23T14:43:51.880Z';
    const d2 = '2023-06-22T14:48:40.880Z';
    const ret = areDatesTheSameDay(d1, d2);
    expect(ret).toBe(false);
  });
});

describe('Tests for withoutTime', () => {
  it('Should return date with time zero', () => {
    const date = '2023-06-23T14:43:51.880Z';
    const ret = withoutTime(date);
    expect(ret).toBe('2023-06-23T00:00:00.000Z');
  });

  it('Should return date with time zero', () => {
    const date = '2023-06-23T00:43:51.880+02:00';
    const ret = withoutTime(date);
    expect(ret).toBe('2023-06-22T00:00:00.000Z');
  });
});
