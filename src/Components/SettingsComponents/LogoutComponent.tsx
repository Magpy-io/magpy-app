import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text } from 'react-native-elements';

import { useAuthFunctions } from '~/Context/UseContexts/useAuthContext';
import { colors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

export default function LogoutComponent() {
  const { logout } = useAuthFunctions();
  const onPress = () => {
    logout().catch(console.log);
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
