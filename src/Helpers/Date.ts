// Converts a string (2023-06-22T14:43:51.880Z) to a Date object
export function StringToDate(date: string) {
  return new Date(date);
}

// Converts a string to the form : Oct 14, 2022, 1:30:23 PM
export function formatDateTime(date: string, locale?: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'medium' }).format(
    dt,
  );
}

// Converts a string to the form : Oct 14, 2022
export function formatDate(date: string, locale?: string) {
  const dt = StringToDate(date);
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(dt);
}

// if two dates are equal, time doesn't matter
export function areDatesTheSameDay(date1: string, date2: string) {
  const dateObj1 = StringToDate(date1);
  const dateObj2 = StringToDate(date2);
  if (!dateObj1 || !dateObj2) {
    return false;
  }
  const timestamp1 = setTimeToZero(dateObj1);
  const timestamp2 = setTimeToZero(dateObj2);
  return timestamp1 === timestamp2;
}

export function setTimeToZero(date: Date) {
  const timestamp = date.setUTCHours(0, 0, 0, 0);
  return timestamp;
}

// Converts a string (2023-06-22T14:43:51.880Z) to a date string without time (2023-06-23T00:00:00.000Z)
export function withoutTime(date: string) {
  const dateObj = StringToDate(date);
  setTimeToZero(dateObj);
  return dateObj.toISOString();
}

export function areDatesTheSameMonth(date1: string, date2: string) {
  const dateObj1 = StringToDate(date1);
  const dateObj2 = StringToDate(date2);
  if (
    dateObj1.getMonth() !== dateObj2.getMonth() ||
    dateObj1.getFullYear() !== dateObj2.getFullYear()
  ) {
    return false;
  }
  return true;
}
