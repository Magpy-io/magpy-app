import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Switch } from 'react-native-paper';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

type SwitchComponentProps = {
  initialState: boolean;
  onSwitchChanged?: (switchState: boolean) => void;
};

export default function SwitchComponent({
  initialState,
  onSwitchChanged,
}: SwitchComponentProps) {
  const [state, setState] = useState(initialState);

  const styles = useStyles(makeStyles);

  return (
    <Switch
      style={{
        transform: [{ scale: 1.4 }],
        margin: 0,
        padding: 0,
      }}
      value={state}
      onValueChange={s => {
        setState(s);
        onSwitchChanged?.(s);
      }}
      color={styles.switch.color}
    />
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    switch: {
      color: colors.PRIMARY,
    },
  });
