import React, { useState } from 'react';
import { View } from 'react-native';

import { Text } from 'react-native-elements';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import {
  getLastYear,
  getThisYear,
  getYearDateRange,
} from '~/Helpers/DateFunctions/DateFunctions';
import { useStyles } from '~/Hooks/useStyles';
import { spacing } from '~/Styles/spacing';

import DateFilterInput from './DateFilterInput';
import Element from './Element';
import { Filter, FilterNameType, FilterObjectType } from './Filter';
import { makeFilterStyles } from './FilterStyle';

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
  const thisYearDateRange = getYearDateRange(getThisYear());
  const lastYearDateRange = getYearDateRange(getLastYear());
  const [customDateStart, setCustomDateStart] = useState(
    new Date(thisYearDateRange.dateStart),
  );
  const [customDateEnd, setCustomDateEnd] = useState(new Date(thisYearDateRange.dateEnd));

  const addOrEditDateFilter = (fromDate: string, toDate: string, label?: DateFilterLabel) => {
    addOrEditFilter({
      type: 'Date',
      params: { fromDate: fromDate, toDate: toDate, label: label },
    });
  };

  const removeDateFilter = () => {
    removeFilter('Date');
  };

  const isCustom = filter?.params?.label === 'custom';

  const editCustomDateFilter = (startDate: Date, endDate: Date) => {
    addOrEditDateFilter(startDate.toISOString(), endDate.toISOString(), 'custom');
  };

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
            addOrEditDateFilter(
              thisYearDateRange.dateStart,
              thisYearDateRange.dateEnd,
              'thisYear',
            );
          }}
        />
        <Element
          title="Last year"
          selected={filter?.params?.label === 'lastYear'}
          onPress={() => {
            addOrEditDateFilter(
              lastYearDateRange.dateStart,
              lastYearDateRange.dateEnd,
              'lastYear',
            );
          }}
        />
        <View style={{ gap: spacing.spacing_xs, alignItems: 'flex-start' }}>
          <Element
            title="Custom"
            selected={isCustom}
            onPress={() => editCustomDateFilter(customDateStart, customDateEnd)}
          />
          {isCustom && (
            <DateFilterInput
              dateStart={customDateStart}
              dateEnd={customDateEnd}
              setDateStart={setCustomDateStart}
              setDateEnd={setCustomDateEnd}
              onChange={editCustomDateFilter}
            />
          )}
        </View>
      </View>
    </View>
  );
}
