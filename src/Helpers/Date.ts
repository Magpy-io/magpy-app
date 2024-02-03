import { DateTime } from 'luxon';

// Converts a string (2023-06-22T14:43:51.880Z) to a DateTime object
export function DateTimeFromIso(date: string) {
  return DateTime.fromISO(date);
}

// Converts a string to the form : Oct 14, 2022, 1:30:23 PM
export function formatDateTime(date: string) {
  const dt = DateTime.fromISO(date);
  return dt.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}

// Converts a string to the form : Oct 14, 2022
export function formatDate(date: string) {
  const dt = DateTime.fromISO(date);
  return dt.toLocaleString(DateTime.DATE_MED);
}

// if two dates are equal, time doesn't matter
export function areDatesEqual(date1: string, date2: string) {
  const dateObj1 = DateTime.fromISO(date1);
  const dateObj2 = DateTime.fromISO(date2);
  if (!dateObj1 || !dateObj2) {
    return false;
  }
  const d1 = setTimeToZero(dateObj1);
  const d2 = setTimeToZero(dateObj2);
  return d1.toMillis() === d2.toMillis();
}

export function setTimeToZero(date: DateTime) {
  const newDate = date.set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  return newDate;
}

// Converts a string (2023-06-22T14:43:51.880Z) to a date string without time (2023-06-23T00:00:00.000Z)
export function withoutTime(date: string) {
  const dateObject = setTimeToZero(DateTime.fromISO(date).toUTC());
  return dateObject.toISO();
}
