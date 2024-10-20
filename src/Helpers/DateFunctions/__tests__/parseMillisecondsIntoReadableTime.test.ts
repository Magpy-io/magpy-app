import { parseMillisecondsIntoReadableTime } from '../DateFormatting';
import { testData } from './parseMillisTestData';

describe('Tests for parseMillisecondsIntoReadableTime function in default mode', () => {
  test('Should return None when millis < 1000', () => {
    expect(parseMillisecondsIntoReadableTime(-1)).toBe('None');
    expect(parseMillisecondsIntoReadableTime(0)).toBe('None');
    expect(parseMillisecondsIntoReadableTime(1)).toBe('None');
    expect(parseMillisecondsIntoReadableTime(999)).toBe('None');
  });

  test.each(testData)('Should return $result for input $millis ms', ({ millis, result }) => {
    expect(parseMillisecondsIntoReadableTime(millis)).toBe(result);
  });
});

describe('Tests for parseMillisecondsIntoReadableTime function in precise mode', () => {
  test('Should return None when millis < 1000', () => {
    expect(parseMillisecondsIntoReadableTime(-1, true)).toBe('None');
    expect(parseMillisecondsIntoReadableTime(0, true)).toBe('None');
    expect(parseMillisecondsIntoReadableTime(1, true)).toBe('None');
    expect(parseMillisecondsIntoReadableTime(999, true)).toBe('None');
  });

  test.each(testData)(
    'Should return $resultPrecise for input $millis ms',
    ({ millis, resultPrecise }) => {
      expect(parseMillisecondsIntoReadableTime(millis, true)).toBe(resultPrecise);
    },
  );
});
