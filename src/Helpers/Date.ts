const locale: string | undefined = undefined;

// Converts a string (2023-06-22T14:43:51.880Z) to a Date object
function StringToDate(date: string) {
  return new Date(date);
}

// Converts a string to the form : Oct 14, 2022, 1:30:23 PM
export function formatDateTime(date: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(dt);
}

// Converts a string to the form : Oct 14, 2022
export function formatDate(date: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(dt);
}

// Converts a string to the form : October 2022
export function formatMonth(date: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
  }).format(dt);
}

// Converts a string to the form : 2022
export function formatYear(date: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(locale, {
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

// should return this year. example: 2024
export function getThisYear() {
  const today = new Date();
  return today.getFullYear();
}

// should return last year. example: 2023
export function getLastYear() {
  return getThisYear() - 1;
}

// should return two dates : January 1st and December 31 of the year
export function getYearDateRange(year: number) {
  const dateStart = new Date(Date.UTC(year, 0, 1)).toISOString();
  const dateEnd = new Date(Date.UTC(year, 11, 31)).toISOString();
  return { dateStart, dateEnd };
}
