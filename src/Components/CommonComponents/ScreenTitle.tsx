import React from 'react';
import { StyleSheet } from 'react-native';

import { Text } from 'react-native-elements';

import { appColors } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function ScreenTitle({ title }: { title: string }) {
  return <Text style={styles.screenTitleStyle}>{title}</Text>;
}

const styles = StyleSheet.create({
  screenTitleStyle: {
    paddingTop: spacing.spacing_xxl_6,
    alignSelf: 'center',
    textAlign: 'center',
    ...typography.screenTitle,
    color: appColors.TEXT,
    paddingHorizontal: spacing.spacing_l,
  },
});
