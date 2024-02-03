import { compareDates } from '../Photos';

it('Should return 0 if same date', () => {
  const d1 = new Date(Date.now());
  const r = compareDates(d1.toISOString(), d1.toISOString());
  expect(r).toBe(0);
});
