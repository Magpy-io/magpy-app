import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthContextFunctions } from '~/Context/Contexts/AuthContext';
import { useMainContext, useMainContextFunctions } from '~/Context/Contexts/MainContext';
import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { useMainStackNavigation } from '../Navigators/MainStackNavigator';

export default function AccountSettingsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);

  const navigation = useMainStackNavigation();
  const { logout } = useAuthContextFunctions();
  const { isUsingLocalAccount } = useMainContext();
  const { setIsUsingLocalAccount } = useMainContextFunctions();

  const { forgetServer } = useServerContextFunctions();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={{ marginLeft: 10, marginTop: 10 }}>Using online account</Text>
      <Switch
        value={!isUsingLocalAccount}
        onValueChange={isOnlineAccount => {
          forgetServer();
          setIsUsingLocalAccount(s => !s);
          logout();
          if (isOnlineAccount) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }}
      />
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    header: {
      paddingTop: spacing.spacing_xl,
      gap: spacing.spacing_xl,
    },
    logoutText: {
      ...typography(colors).mediumTextBold,
      color: colors.ERROR,
    },
    title: {
      ...typography(colors).sectionTitle,
      paddingVertical: spacing.spacing_l,
    },
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
  });
