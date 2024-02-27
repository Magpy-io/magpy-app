import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';

import DatePicker from 'react-native-date-picker';
import { Text } from 'react-native-elements';

import { formatDate } from '~/Helpers/DateFunctions/DateFormatting';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

type DateInputProps = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  onChange?: (date: Date) => void;
  style?: ViewStyle;
};

export default function DateInput({ date, setDate, onChange, style }: DateInputProps) {
  const [open, setOpen] = useState(false);
  const styles = useStyles(makeStyles);

  const dateText = formatDate(date.toISOString());
  return (
    <View style={style}>
      <TouchableOpacity style={styles.inputContainer} onPress={() => setOpen(true)}>
        <Text style={styles.inputText}>{dateText}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        mode="date"
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
          onChange ? onChange(date) : undefined;
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    inputText: {
      ...typography(colors).mediumText,
    },
    inputContainer: {
      paddingVertical: spacing.spacing_s,
      paddingHorizontal: spacing.spacing_l,
      borderColor: colors.FORM_BORDER,
      borderRadius: borderRadius.small,
      borderWidth: 1,
    },
  });
