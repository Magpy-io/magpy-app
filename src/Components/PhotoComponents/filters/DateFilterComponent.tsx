import React, { useState } from 'react';
import { View } from 'react-native';

import { Text } from 'react-native-elements';

import {
  getLastYear,
  getThisYear,
  getYearDateRange,
} from '~/Helpers/DateFunctions/DateFunctions';
import { useStyles } from '~/Hooks/useStyles';
import { spacing } from '~/Styles/spacing';

import DateFilterInput from './DateFilterInput';
import Element from './Element';
import { makeFilterStyles } from './FilterStyle';
import { DateFilterLabel, DateFilterObjectType } from './Filters/DateFilter';
import { FilterNameType, FilterObjectType } from './Filters/Filter';

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
