import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text } from 'react-native-elements';

import { useAuthContextFunctions } from '~/Context/Contexts/AuthContext';
import { useStyles } from '~/Hooks/useStyles';
import { useTabNavigationContext } from '~/Navigation/TabNavigation/TabNavigationContext';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export default function LogoutComponent() {
  const { logout } = useAuthContextFunctions();
  const { resetFocusedTab } = useTabNavigationContext();
  const onPress = () => {
    logout();
    resetFocusedTab();
  };
  const styles = useStyles(makeStyles);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.logoutText}>Log out</Text>
    </TouchableOpacity>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing.spacing_l,
    },
    logoutText: {
      ...typography(colors).mediumTextBold,
      color: colors.ERROR,
    },
  });
