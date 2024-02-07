import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';

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
    alignSelf: 'center',
    color: colors.SOFT_GREY,
    fontFamily: 'Inter-Medium',
  },
  container: {
    flex: 1,
    backgroundColor: colors.DARK,
    justifyContent: 'center',
  },
});
