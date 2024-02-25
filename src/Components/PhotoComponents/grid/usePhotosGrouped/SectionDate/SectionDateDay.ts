import { formatDate, makeDateFrom, splitDateComponents } from '~/Helpers/Date';

import { SectionDate, SectionDateType } from './SectionDate';

export class SectionDateDay implements SectionDate {
  type: SectionDateType;
  year: number;
  month: number;
  day: number;

  constructor(date: string) {
    this.type = 'Day';
    const { year, month, day } = splitDateComponents(date);
    this.year = year;
    this.month = month;
    this.day = day;
  }

  includesDate(date: string) {
    const { year, month, day } = splitDateComponents(date);
    return this.year == year && this.month == month && this.day == day;
  }

  getTitle() {
    const date = makeDateFrom({
      day: this.day,
      month: this.month,
      year: this.year,
    });
    return formatDate(date);
  }
}
