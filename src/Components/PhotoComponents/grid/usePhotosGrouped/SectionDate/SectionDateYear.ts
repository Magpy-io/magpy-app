import { formatYear, makeDateFrom, splitDateComponents } from '~/Helpers/Date';

import { SectionDate, SectionDateType } from './SectionDate';

export class SectionDateYear implements SectionDate {
  type: SectionDateType;
  year: number;

  constructor(date: string) {
    this.type = 'Year';
    const { year } = splitDateComponents(date);
    this.year = year;
  }

  includesDate(date: string) {
    const { year } = splitDateComponents(date);
    return this.year == year;
  }

  getTitle() {
    const date = makeDateFrom({ year: this.year });
    return formatYear(date);
  }
}
