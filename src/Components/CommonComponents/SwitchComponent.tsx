import React from 'react';
import { StyleSheet } from 'react-native';

import { Switch } from 'react-native-paper';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

type SwitchComponentProps = {
  state: boolean;
  disabled?: boolean;
  onSwitchChanged?: (switchState: boolean) => void;
};

export default function SwitchComponent({
  state,
  disabled,
  onSwitchChanged,
}: SwitchComponentProps) {
  const styles = useStyles(makeStyles);

  return (
    <Switch
      style={{
        transform: [{ scale: 1.4 }],
        margin: 0,
        padding: 0,
      }}
      value={state}
      onValueChange={onSwitchChanged}
      color={styles.switch.color}
      disabled={disabled}
    />
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    switch: {
      color: colors.PRIMARY,
    },
  });
