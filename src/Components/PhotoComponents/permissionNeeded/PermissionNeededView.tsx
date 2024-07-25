import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { typography } from '~/Styles/typography';

export default function PermissionNeededView() {
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.viewStyle, { paddingTop: insets.top + 15 }]}>
      <Text style={styles.textStyle}>Media permissions are needed</Text>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    viewStyle: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
    textStyle: {
      textAlign: 'center',
      ...typography(colors).largeText,
    },
  });
