import { StringToDate } from './DateFunctions';

const locale: string = 'en';
const timezone: string = 'CET';

const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: timezone,
});

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'medium',
  timeZone: timezone,
});

const monthFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  timeZone: timezone,
});

const yearFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  timeZone: timezone,
});

// Converts a string to the form : Oct 14, 2022, 1:30:23 PM
export function formatDateTime(date: string) {
  const dt = StringToDate(date);
  return dateTimeFormatter.format(dt);
}

// Converts a string to the form : Oct 14, 2022
export function formatDate(date: string) {
  const dt = StringToDate(date);
  return dateFormatter.format(dt);
}

// Converts a string to the form : October 2022
export function formatMonth(date: string) {
  const dt = StringToDate(date);
  return monthFormatter.format(dt);
}

// Converts a string to the form : 2022
export function formatYear(date: string) {
  const dt = StringToDate(date);
  return yearFormatter.format(dt);
}
