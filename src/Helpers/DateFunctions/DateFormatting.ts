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

// Converts a time difference in millis to readable
export function parseMillisecondsIntoReadableTime(
  milliseconds: number,
  precise: boolean = false,
) {
  //Get days from milliseconds
  const days = milliseconds / (1000 * 60 * 60 * 24);
  const absoluteDays = Math.floor(days);
  const daysString =
    absoluteDays == 0 ? '' : absoluteDays == 1 ? '1 day' : absoluteDays + ' days';

  //Get remainder from days and convert to hours
  const hours = milliseconds / (1000 * 60 * 60);
  const remainderHours = hours - absoluteDays * 24;
  const absoluteHours = Math.floor(remainderHours);
  const hoursString =
    absoluteHours == 0 ? '' : absoluteHours == 1 ? '1 hour' : absoluteHours + ' hours';

  //Get remainder from hours and convert to minutes
  const minutes = milliseconds / (1000 * 60);
  const remainderMinutes = minutes - absoluteHours * 60 - absoluteDays * 60 * 24;
  const absoluteMinutes = Math.floor(remainderMinutes);
  const minutesString =
    absoluteMinutes == 0
      ? ''
      : absoluteMinutes == 1
        ? '1 minute'
        : absoluteMinutes + ' minutes';

  //Get remainder from minutes and convert to seconds
  const seconds = milliseconds / 1000;
  const remainderSeconds =
    seconds - absoluteMinutes * 60 - absoluteHours * 60 * 60 - absoluteDays * 60 * 60 * 24;
  const absoluteSeconds = Math.floor(remainderSeconds);
  const secondsString =
    absoluteSeconds == 0
      ? ''
      : absoluteSeconds == 1
        ? '1 second'
        : absoluteSeconds + ' seconds';

  let ret;

  if (precise) {
    ret =
      daysString +
      (daysString && ' ') +
      hoursString +
      (hoursString && ' ') +
      minutesString +
      (minutesString && ' ') +
      secondsString;
  } else {
    if (daysString) {
      ret = daysString;
    } else if (hoursString) {
      ret = hoursString;
    } else if (minutesString) {
      ret = minutesString;
    } else {
      ret = secondsString;
    }
  }

  return ret ?? 'None';
}
