import { formatMonth } from '~/Helpers/DateFunctions/DateFormatting';
import {
  makeUTCDateFrom,
  splitUTCDateComponents,
} from '~/Helpers/DateFunctions/DateFunctions';

import { SectionDate, SectionDateType } from './SectionDate';

export class SectionDateMonth implements SectionDate {
  type: SectionDateType;
  year: number;
  month: number;

  constructor(date: string) {
    this.type = 'Month';
    const { year, month } = splitUTCDateComponents(date);
    this.year = year;
    this.month = month;
  }

  includesDate(date: string) {
    const { year, month } = splitUTCDateComponents(date);
    return this.year == year && this.month == month;
  }

  getTitle() {
    const date = makeUTCDateFrom({ month: this.month, year: this.year });
    return formatMonth(date);
  }
}
