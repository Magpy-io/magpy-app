import { StringToDate } from './DateFunctions';

const locale: string = 'en';
const timezone: string = 'CET';

// Converts a string to the form : Oct 14, 2022, 1:30:23 PM
export function formatDateTime(
  date: string,
  params?: { localeOverride?: string; timezoneOverride?: string },
) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(params?.localeOverride ?? locale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: params?.timezoneOverride ?? timezone,
  }).format(dt);
}

// Converts a string to the form : Oct 14, 2022
export function formatDate(
  date: string,
  params?: { localeOverride?: string; timezoneOverride?: string },
) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(params?.localeOverride ?? locale, {
    dateStyle: 'medium',
    timeZone: params?.timezoneOverride ?? timezone,
  }).format(dt);
}

// Converts a string to the form : October 2022
export function formatMonth(
  date: string,
  params?: { localeOverride?: string; timezoneOverride?: string },
) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(params?.localeOverride ?? locale, {
    year: 'numeric',
    month: 'long',
    timeZone: params?.timezoneOverride ?? timezone,
  }).format(dt);
}

// Converts a string to the form : 2022
export function formatYear(
  date: string,
  params?: { localeOverride?: string; timezoneOverride?: string },
) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(params?.localeOverride ?? locale, {
    year: 'numeric',
    timeZone: params?.timezoneOverride ?? timezone,
  }).format(dt);
}
