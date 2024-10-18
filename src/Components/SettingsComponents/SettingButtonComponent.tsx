import React from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';

import { useStyles } from '~/Hooks/useStyles';
import { spacing } from '~/Styles/spacing';

import { PrimaryButtonSmall } from '../CommonComponents/Buttons';

type SettingButtonComponentProps = {
  title: string;
  onPress: () => void;
  style?: TextStyle;
  align?: 'left' | 'center' | 'right';
};

export default function SettingButtonComponent({
  title,
  onPress,
  align,
}: SettingButtonComponentProps) {
  const styles = useStyles(makeStyles);

  const styleAlign =
    align == 'left'
      ? styles.containerAlignLeft
      : align == 'center'
        ? styles.containerAlignCenter
        : styles.containerAlignRight;

  return (
    <View style={[styles.container, styleAlign]}>
      <PrimaryButtonSmall onPress={onPress} title={title} />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      height: spacing.spacing_xxl_2,
    },
    containerAlignLeft: {
      justifyContent: 'flex-start',
    },
    containerAlignCenter: {
      justifyContent: 'center',
    },
    containerAlignRight: {
      justifyContent: 'flex-end',
    },
  });
