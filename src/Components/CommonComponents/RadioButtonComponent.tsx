import React from 'react';
import { StyleSheet } from 'react-native';

import { RadioButton } from 'react-native-paper';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

type RadioButtonComponentProps = {
  name: string;
  checked: string;
  disabled?: boolean;
  onPress?: () => void;
};

export default function RadioButtonComponent({
  name,
  checked,
  disabled,
  onPress,
}: RadioButtonComponentProps) {
  const styles = useStyles(makeStyles);

  return (
    <RadioButton
      value={name}
      status={checked === name ? 'checked' : 'unchecked'}
      onPress={onPress}
      color={styles.radioButton.color}
      disabled={disabled}
    />
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    radioButton: {
      color: colors.PRIMARY,
    },
  });
