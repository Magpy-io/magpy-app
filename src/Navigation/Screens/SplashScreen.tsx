import React from 'react';
import { StyleSheet } from 'react-native';

import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textStyle}>Propio</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: spacing.spacing_xxl,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: colors.SOFT_GREY,
  },
  container: {
    flex: 1,
    backgroundColor: colors.DARK,
    justifyContent: 'center',
  },
});
