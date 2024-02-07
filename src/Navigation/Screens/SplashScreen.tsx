import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Logo from '~/Images/LogoCompleteBlackBlue.svg';
import { appColors, colors } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* <Text style={styles.textStyle}>Propio</Text> */}
      <Logo width={180} />
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
    backgroundColor: appColors.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
