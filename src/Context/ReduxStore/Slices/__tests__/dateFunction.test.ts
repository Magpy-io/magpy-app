import { compareDates } from '../Photos';

const dateRecent = '2024-02-03T11:30:40.000Z';
const dateOld = '2024-02-03T11:30:30.000Z';

it('Should return 0 if same date', () => {
  const r = compareDates(dateRecent, dateRecent);
  expect(r).toBe(0);
});

it('Should return positive if date1 bigger than date2', () => {
  const r = compareDates(dateRecent, dateOld);
  expect(r).toBeGreaterThan(0);
});

it('Should return negative if date1 smaller than date2', () => {
  const r = compareDates(dateOld, dateRecent);
  expect(r).toBeLessThan(0);
});

it.each([{ date: 'invalidDate' }, { date: null }, { date: undefined }])(
  'Should return positive if date2 is an invalid',
  testData => {
    const r = compareDates(dateOld, testData.date as string);
    expect(r).toBeGreaterThan(0);
  },
);

it.each([{ date: 'invalidDate' }, { date: null }, { date: undefined }])(
  'Should return negative if date1 is an invalid',
  testData => {
    const r = compareDates(testData.date as string, dateOld);
    expect(r).toBeLessThan(0);
  },
);
