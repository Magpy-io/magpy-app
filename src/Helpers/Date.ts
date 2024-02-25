const locale: string = 'en';

// Converts a string (2023-06-22T14:43:51.880Z) to a Date object
function StringToDate(date: string) {
  return new Date(date);
}

// Converts a string to the form : Oct 14, 2022, 1:30:23 PM
export function formatDateTime(date: string, localeOverride?: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(localeOverride ?? locale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(dt);
}

// Converts a string to the form : Oct 14, 2022
export function formatDate(date: string, localeOverride?: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(localeOverride ?? locale, { dateStyle: 'medium' }).format(dt);
}

// Converts a string to the form : October 2022
export function formatMonth(date: string, localeOverride?: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(localeOverride ?? locale, {
    year: 'numeric',
    month: 'long',
  }).format(dt);
}

// Converts a string to the form : 2022
export function formatYear(date: string, localeOverride?: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(localeOverride ?? locale, {
    year: 'numeric',
  }).format(dt);
}

export function splitDateComponents(date: string) {
  const dt = StringToDate(date);
  const year = dt.getFullYear();
  const month = dt.getMonth();
  const day = dt.getDate();

  return { year, month, day };
}

export function makeDateFrom(options: { day?: number; month?: number; year?: number }) {
  const date = new Date(0);
  date.setDate(options.day ?? 1);
  date.setMonth(options.month ?? 0);
  date.setFullYear(options.year ?? 0);
  return date.toISOString();
}
