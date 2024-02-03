import { areDatesEqual } from '../Date';

it('Should return true if same date', () => {
  const d1 = '2023-06-22T14:43:51.880Z';
  const d2 = '2023-06-22T14:48:40.880Z';
  const ret = areDatesEqual(d1, d2);
  expect(ret).toBe(true);
});
