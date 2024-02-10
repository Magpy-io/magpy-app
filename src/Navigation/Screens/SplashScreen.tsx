import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStyles } from '~/Hooks/useStyles';
import Logo from '~/Images/LogoCompleteBlackBlue.svg';
import { colorsType } from '~/Styles/colors';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Logo width={180} />
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
