// Converts a string (2023-06-22T14:43:51.880Z) to a Date object
export function StringToDate(date: string) {
  return new Date(date);
}

export function splitUTCDateComponents(date: string) {
  const dt = StringToDate(date);
  const year = dt.getUTCFullYear();
  const month = dt.getUTCMonth();
  const day = dt.getUTCDate();

  return { year, month, day };
}

export function makeUTCDateFrom(options: { day?: number; month?: number; year?: number }) {
  const date = new Date(0);
  date.setUTCDate(options.day ?? 1);
  date.setUTCMonth(options.month ?? 0);
  date.setUTCFullYear(options.year ?? 0);
  return date.toISOString();
}
