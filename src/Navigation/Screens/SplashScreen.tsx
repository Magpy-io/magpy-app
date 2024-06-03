import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import LogoLight from '~/Images/LogoCompleteBlackBlue.svg';
import LogoDark from '~/Images/LogoCompleteWhiteBlue.svg';
import { colorsType } from '~/Styles/colors';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);
  const { dark } = useTheme();
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {dark ? <LogoDark width={180} /> : <LogoLight width={180} />}
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
