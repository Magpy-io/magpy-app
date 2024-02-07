import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text } from 'react-native-elements';

import { useAuthFunctions } from '~/Context/UseContexts/useAuthContext';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';
import { colors } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function LogoutComponent() {
  const { logout } = useAuthFunctions();
  const { resetFocusedTab } = useTabNavigationContext();
  const onPress = () => {
    logout().catch(console.log);
    resetFocusedTab();
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.logoutText}>Log out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.spacing_l,
  },
  logoutText: {
    ...typography.mediumTextBold,
    color: colors.COLOR_ERROR_500,
  },
});
