import { formatMonth, makeDateFrom, splitDateComponents } from '~/Helpers/Date';

import { SectionDate, SectionDateType } from './SectionDate';

export class SectionDateMonth implements SectionDate {
  type: SectionDateType;
  year: number;
  month: number;

  constructor(date: string) {
    this.type = 'Month';
    const { year, month } = splitDateComponents(date);
    this.year = year;
    this.month = month;
  }

  includesDate(date: string) {
    const { year, month } = splitDateComponents(date);
    return this.year == year && this.month == month;
  }

  getTitle() {
    const date = makeDateFrom({ month: this.month, year: this.year });
    return formatMonth(date);
  }
}
