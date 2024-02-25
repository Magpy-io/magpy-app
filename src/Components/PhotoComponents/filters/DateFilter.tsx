import React from 'react';
import { View } from 'react-native';

import { Text } from 'react-native-elements';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { getLastYear, getThisYear, getYearDateRange } from '~/Helpers/Date';
import { useStyles } from '~/Hooks/useStyles';

import Element from './Element';
import { Filter, FilterNameType, FilterObjectType } from './Filter';
import { makeFilterStyles } from './FilterStyle';

export type DateFilterName = 'Date';
export type DateFilterLabel = 'thisYear' | 'lastYear';
export type DateFilterParams = { fromDate: string; toDate: string; label?: DateFilterLabel };
export type DateFilterObjectType = { type: DateFilterName; params: DateFilterParams };

export class DateFilter implements Filter {
  type: DateFilterName;
  fromDate: string;
  toDate: string;
  label?: DateFilterLabel;

  constructor(fromDate: string, toDate: string, label?: DateFilterLabel) {
    this.type = 'Date';
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.label = label;
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

type DateProps = {
  filter: DateFilterObjectType | undefined;
  addOrEditFilter: (filter: FilterObjectType) => void;
  removeFilter: (type: FilterNameType) => void;
};

export default function DateFilterComponent({
  filter,
  addOrEditFilter,
  removeFilter,
}: DateProps) {
  const styles = useStyles(makeFilterStyles);

  const addFilter = (fromDate: string, toDate: string, label?: DateFilterLabel) => {
    addOrEditFilter({
      type: 'Date',
      params: { fromDate: fromDate, toDate: toDate, label: label },
    });
  };

  const removeDateFilter = () => {
    removeFilter('Date');
  };

  const thisYearDateRange = getYearDateRange(getThisYear());
  const lastYearDateRange = getYearDateRange(getLastYear());

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Date</Text>
      <View style={styles.elementListView}>
        <Element
          title="All time"
          selected={filter?.params?.fromDate == null}
          onPress={removeDateFilter}
        />
        <Element
          title="This year"
          selected={filter?.params?.label === 'thisYear'}
          onPress={() => {
            addFilter(thisYearDateRange.dateStart, thisYearDateRange.dateEnd, 'thisYear');
          }}
        />
        <Element
          title="Last year"
          selected={filter?.params?.label === 'lastYear'}
          onPress={() => {
            addFilter(lastYearDateRange.dateStart, lastYearDateRange.dateEnd, 'lastYear');
          }}
        />
      </View>
    </View>
  );
}
