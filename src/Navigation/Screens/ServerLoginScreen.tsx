import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import KeyboardDismissingView from '~/Components/CommonComponents/KeyboardDismissingView';
import ScreenTitle from '~/Components/CommonComponents/ScreenTitle';
import { LoginServerForm } from '~/Components/LoginComponents/LoginServerForm';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';

export default function ServerLoginScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardDismissingView>
        <ScreenTitle title="Login to your server" />
        <LoginServerForm />
      </KeyboardDismissingView>
    </View>
  );
}

const PADDING_HORIZONTAl = spacing.spacing_xxl;

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    loginFooterStyle: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: spacing.spacing_xxl_5,
      paddingHorizontal: PADDING_HORIZONTAl,
      alignItems: 'center',
    },
    container: {
      flex: 1,
      paddingHorizontal: PADDING_HORIZONTAl,
      backgroundColor: colors.BACKGROUND,
    },
  });
