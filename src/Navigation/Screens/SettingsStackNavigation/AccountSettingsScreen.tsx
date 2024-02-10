import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { typography } from '~/Styles/typography';

export default function AccountSettingsScreen() {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account settings</Text>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 60,
      backgroundColor: colors.BACKGROUND,
    },
    text: {
      ...typography(colors).mediumText,
    },
  });
