import { GroupType } from '~/Context/ReduxStore/Slices/GalleryOptions/GalleryOptions';

import { SectionDate } from './SectionDate';
import { SectionDateDay } from './SectionDateDay';
import { SectionDateMonth } from './SectionDateMonth';
import { SectionDateYear } from './SectionDateYear';

export class SectionDateFactory {
  createSectionDate(date: string, groupType: GroupType): SectionDate {
    switch (groupType) {
      case 'Day':
        return new SectionDateDay(date);
      case 'Month':
        return new SectionDateMonth(date);
      case 'Year':
        return new SectionDateYear(date);
      default:
        return new SectionDateDay(date);
    }
  }
}
