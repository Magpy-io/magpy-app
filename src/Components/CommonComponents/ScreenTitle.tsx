import React from 'react';
import { StyleSheet } from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function ScreenTitle({ title }: { title: string }) {
  const styles = useStyles(makeStyles);
  return <Text style={styles.screenTitleStyle}>{title}</Text>;
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    screenTitleStyle: {
      paddingTop: spacing.spacing_xxl_6,
      alignSelf: 'center',
      textAlign: 'center',
      ...typography(colors).screenTitle,
      color: colors.TEXT,
      paddingHorizontal: spacing.spacing_l,
    },
  });
