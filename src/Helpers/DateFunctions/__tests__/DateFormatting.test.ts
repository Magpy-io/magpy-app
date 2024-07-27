import { formatDate, formatDateTime, formatMonth, formatYear } from '../DateFormatting';

const testDate = '2023-06-22T15:43:51.880Z';

describe('Tests for Date Formatting functions', () => {
  test(`formatDateTime should return "Jun 22, 2023, 3:43:51 PM" for date "${testDate}"`, () => {
    const formatedDate = formatDateTime(testDate);
    expect(formatedDate).toEqual('Jun 22, 2023, 3:43:51 PM');
  });

  test(`formatDate should return "Jun 22, 2023" for date "${testDate}"`, () => {
    const formatedDate = formatDate(testDate);
    expect(formatedDate).toEqual('Jun 22, 2023');
  });

  test(`formatMonth should return "June 2023" for date "${testDate}"`, () => {
    const formatedDate = formatMonth(testDate);
    expect(formatedDate).toEqual('June 2023');
  });

  test(`formatYear should return "2023" for date "${testDate}"`, () => {
    const formatedDate = formatYear(testDate);
    expect(formatedDate).toEqual('2023');
  });
});
