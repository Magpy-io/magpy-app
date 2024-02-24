import { GroupType } from '~/Context/ReduxStore/Slices/GalleryOptions/GalleryOptions';
import {
  formatDate,
  formatMonth,
  formatYear,
  makeDateFrom,
  splitDateComponents,
} from '~/Helpers/Date';

type SectionDateType =
  | { type: 'Day'; year: number; month: number; day: number }
  | { type: 'Month'; year: number; month: number }
  | { type: 'Year'; year: number };

export class SectionDate {
  date: SectionDateType;

  constructor(date: string, groupingType: GroupType) {
    const { year, month, day } = splitDateComponents(date);
    switch (groupingType) {
      case 'Day':
        this.date = { type: 'Day', year, month, day };
        break;

      case 'Month':
        this.date = { type: 'Month', year, month };

        break;

      case 'Year':
        this.date = { type: 'Year', year };
        break;

      default:
        console.log(
          'SectionDate: groupingType',
          groupingType,
          'does not exist in type GroupType',
        );
        this.date = { type: 'Day', year, month, day };
        break;
    }
  }

  includesDate(date: string) {
    const { year, month, day } = splitDateComponents(date);
    if (this.date.type == 'Year') {
      return this.date.year == year;
    }

    if (this.date.type == 'Month') {
      return this.date.year == year && this.date.month == month;
    }

    if (this.date.type == 'Day') {
      return this.date.year == year && this.date.month == month && this.date.day == day;
    }

    return false;
  }

  getTitle() {
    if (this.date.type == 'Day') {
      const date = makeDateFrom({
        day: this.date.day,
        month: this.date.month,
        year: this.date.year,
      });
      return formatDate(date);
    }

    if (this.date.type == 'Month') {
      const date = makeDateFrom({ month: this.date.month, year: this.date.year });
      return formatMonth(date);
    }

    if (this.date.type == 'Year') {
      const date = makeDateFrom({ year: this.date.year });
      return formatYear(date);
    }

    console.log('SectionDate.getTitle: this.date.type has unexpected value');
    return 'Undefined';
  }
}
