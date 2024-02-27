import { formatDate } from '~/Helpers/DateFunctions/DateFormatting';
import {
  makeUTCDateFrom,
  splitUTCDateComponents,
} from '~/Helpers/DateFunctions/DateFunctions';

import { SectionDate, SectionDateType } from './SectionDate';

export class SectionDateDay implements SectionDate {
  type: SectionDateType;
  year: number;
  month: number;
  day: number;

  constructor(date: string) {
    this.type = 'Day';
    const { year, month, day } = splitUTCDateComponents(date);
    this.year = year;
    this.month = month;
    this.day = day;
  }

  includesDate(date: string) {
    const { year, month, day } = splitUTCDateComponents(date);
    return this.year == year && this.month == month && this.day == day;
  }

  getTitle() {
    const date = makeUTCDateFrom({
      day: this.day,
      month: this.month,
      year: this.year,
    });
    return formatDate(date);
  }
}
