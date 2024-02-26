import React from 'react';
import { StyleSheet, View } from 'react-native';

import DateInput from '~/Components/CommonComponents/DateInput';
import { ArrowIcon } from '~/Components/CommonComponents/Icons';
import { spacing } from '~/Styles/spacing';

type DateFilterInputProps = {
  dateStart: Date;
  dateEnd: Date;
  setDateStart: React.Dispatch<React.SetStateAction<Date>>;
  setDateEnd: React.Dispatch<React.SetStateAction<Date>>;
  onChange?: (startDate: Date, endDate: Date) => void;
};

export default function DateFilterInput({
  dateStart,
  dateEnd,
  setDateStart,
  setDateEnd,
  onChange,
}: DateFilterInputProps) {
  return (
    <View style={styles.view}>
      <DateInput
        date={dateStart}
        setDate={setDateStart}
        onChange={(date: Date) => (onChange ? onChange(date, dateEnd) : undefined)}
      />
      <ArrowIcon />
      <DateInput
        date={dateEnd}
        setDate={setDateEnd}
        onChange={(date: Date) => (onChange ? onChange(dateStart, date) : undefined)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    gap: spacing.spacing_xs,
    alignItems: 'center',
  },
});
