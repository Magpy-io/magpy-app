import { compareDates, makeUTCDateFrom, splitUTCDateComponents } from '../DateFunctions';

describe('Tests for splitDateComponents function ', () => {
  const test1Date = '2023-06-22T16:43:51.880Z';
  it(`Should return day: 22, month: 5, year: 2023 for date "${test1Date}"`, () => {
    const { day, month, year } = splitUTCDateComponents(test1Date);
    expect(day).toBe(22);
    expect(month).toBe(5);
    expect(year).toBe(2023);
  });

  const test2Date = '2023-06-22T23:43:51.880Z';
  it(`Should return day: 22 for date "${test2Date}" and CET timezone`, () => {
    const { day } = splitUTCDateComponents(test2Date);
    expect(day).toBe(22);
  });
});

describe('Tests for makeDateFrom function ', () => {
  it('Should return date where day: 23, month:3 and year: 2022 when used with parameter { day: 23, month: 3, year: 2022 }', () => {
    const date = makeUTCDateFrom({ day: 23, month: 3, year: 2022 });
    const { day, month, year } = splitUTCDateComponents(date);
    expect(day).toBe(23);
    expect(month).toBe(3);
    expect(year).toBe(2022);
  });

  it('Should return date where month: 0 when used with parameter { month: 0 }', () => {
    const date = makeUTCDateFrom({ month: 0 });
    const { month } = splitUTCDateComponents(date);
    expect(month).toBe(0);
  });

  it('Should return date where month: 1 when used with parameter { month: 1 }', () => {
    const date = makeUTCDateFrom({ month: 1 });
    const { month } = splitUTCDateComponents(date);
    expect(month).toBe(1);
  });

  it('Should return date where year: 2022 when used with parameter { year: 2022 }', () => {
    const date = makeUTCDateFrom({ year: 2022 });
    const { year } = splitUTCDateComponents(date);
    expect(year).toBe(2022);
  });
});

describe('Tests for compareDates function', () => {
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
});
