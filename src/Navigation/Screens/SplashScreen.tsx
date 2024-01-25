import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={styles.textStyle}>Propio</Text>
    </View>
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
