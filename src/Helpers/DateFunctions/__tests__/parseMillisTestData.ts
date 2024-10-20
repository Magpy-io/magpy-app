export const testData: { millis: number; result: string; resultPrecise: string }[] = [
  {
    millis: 1000,
    result: '1 second',
    resultPrecise: '1 second',
  },
  {
    millis: 1500,
    result: '1 second',
    resultPrecise: '1 second',
  },
  {
    millis: 2000,
    result: '2 seconds',
    resultPrecise: '2 seconds',
  },
  {
    millis: 60 * 1000,
    result: '1 minute',
    resultPrecise: '1 minute',
  },
  {
    millis: 60 * 1000 + 5000,
    result: '1 minute',
    resultPrecise: '1 minute 5 seconds',
  },
  {
    millis: 2 * 60 * 1000,
    result: '2 minutes',
    resultPrecise: '2 minutes',
  },
  {
    millis: 60 * 60 * 1000,
    result: '1 hour',
    resultPrecise: '1 hour',
  },
  {
    millis: 60 * 60 * 1000 + 60 * 5000 + 5000,
    result: '1 hour',
    resultPrecise: '1 hour 5 minutes 5 seconds',
  },
  {
    millis: 2 * 60 * 60 * 1000,
    result: '2 hours',
    resultPrecise: '2 hours',
  },
  {
    millis: 24 * 60 * 60 * 1000,
    result: '1 day',
    resultPrecise: '1 day',
  },
  {
    millis: 24 * 60 * 60 * 1000 + 60 * 60 * 5000 + 60 * 5000 + 5000,
    result: '1 day',
    resultPrecise: '1 day 5 hours 5 minutes 5 seconds',
  },
  {
    millis: 2 * 24 * 60 * 60 * 1000,
    result: '2 days',
    resultPrecise: '2 days',
  },
  {
    millis: 3 * 24 * 60 * 60 * 1000 + 1000,
    result: '3 days',
    resultPrecise: '3 days 1 second',
  },
  {
    millis: 40 * 24 * 60 * 60 * 1000 + 59 * 60 * 1000 + 3000,
    result: '40 days',
    resultPrecise: '40 days 59 minutes 3 seconds',
  },
  {
    millis: 1 * 60 * 60 * 1000 + 60 * 1000,
    result: '1 hour',
    resultPrecise: '1 hour 1 minute',
  },
  {
    millis: 22 * 60 * 60 * 1000 + 59 * 1000,
    result: '22 hours',
    resultPrecise: '22 hours 59 seconds',
  },
];
