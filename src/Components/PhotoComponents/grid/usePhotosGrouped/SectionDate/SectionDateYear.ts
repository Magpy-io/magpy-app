import { formatYear } from '~/Helpers/DateFunctions/DateFormatting';
import {
  makeUTCDateFrom,
  splitUTCDateComponents,
} from '~/Helpers/DateFunctions/DateFunctions';

import { SectionDate, SectionDateType } from './SectionDate';

export class SectionDateYear implements SectionDate {
  type: SectionDateType;
  year: number;

  constructor(date: string) {
    this.type = 'Year';
    const { year } = splitUTCDateComponents(date);
    this.year = year;
  }

  includesDate(date: string) {
    const { year } = splitUTCDateComponents(date);
    return this.year == year;
  }

  getTitle() {
    const date = makeUTCDateFrom({ year: this.year });
    return formatYear(date);
  }
}
