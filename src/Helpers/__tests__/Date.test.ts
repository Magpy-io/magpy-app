import { areDatesEqual, withoutTime } from '../Date';

it('Should return true if same date', () => {
  const d1 = '2023-06-22T14:43:51.880Z';
  const d2 = '2023-06-22T14:48:40.880Z';
  const ret = areDatesEqual(d1, d2);
  expect(ret).toBe(true);
});

it('Should return false if not same date', () => {
  const d1 = '2023-06-23T14:43:51.880Z';
  const d2 = '2023-06-22T14:48:40.880Z';
  const ret = areDatesEqual(d1, d2);
  expect(ret).toBe(false);
});

it('Should return date with time zero', () => {
  const date = '2023-06-23T14:43:51.880Z';
  const ret = withoutTime(date);
  expect(ret).toBe('2023-06-23T00:00:00.000Z');
});