import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';

import { Filter } from './Filter';

export type DateFilterName = 'Date';
export type DateFilterLabel = 'thisYear' | 'lastYear' | 'custom';
export type DateFilterParams = { fromDate: string; toDate: string; label?: DateFilterLabel };
export type DateFilterObjectType = { type: DateFilterName; params: DateFilterParams };

export class DateFilter implements Filter {
  type: DateFilterName;
  fromDate: string;
  toDate: string;
  label?: DateFilterLabel;

  constructor(params: DateFilterParams) {
    this.type = 'Date';
    this.fromDate = params.fromDate;
    this.toDate = params.toDate;
    this.label = params.label;
  }

  filter(photos: PhotoGalleryType[]) {
    const fromDateTimestamp = Date.parse(this.fromDate);
    const toDateTimestamp = Date.parse(this.toDate);
    console.log('filter photos by date', this.fromDate, this.toDate);
    return photos.filter(photo => {
      const timestamp = Date.parse(photo.date);
      if (timestamp >= fromDateTimestamp && timestamp <= toDateTimestamp) {
        return true;
      }
      return false;
    });
  }

  toObject() {
    return {
      type: this.type,
      params: { fromDate: this.fromDate, toDate: this.toDate, label: this.label },
    };
  }
}
