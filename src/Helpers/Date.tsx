import { DateTime } from "luxon";

// Converts a string (2023-06-22T14:43:51.880Z) to a DateTime object
export function DateTimeFromIso(date: string) {
  return DateTime.fromISO(date);
}

// Converts a string to the form : Oct 14, 2022, 1:30:23 PM
export function formatDate(date: string) {
  const dt = DateTime.fromISO(date);
  return dt.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}
