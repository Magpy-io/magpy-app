import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthContext, useAuthFunctions } from '~/Context/UseContexts/useAuthContext';
import { useServerContext } from '~/Context/UseContexts/useServerContext';
import { appColors } from '~/styles/colors';

import { useMainNavigation } from '../../Navigation';

export default function SettingsScreenTab() {
  const { user } = useAuthContext();
  const { logout } = useAuthFunctions();
  const { isServerReachable } = useServerContext();
  const navigation = useMainNavigation();

  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Button
        title="Account Settings"
        onPress={() =>
          navigation.navigate('SettingsStackNavigator', { screen: 'ServerSettings' })
        }
      />
      <Text>{`User Id : ${user?._id}`}</Text>
      <Text>{user?.email}</Text>
      <Text>{isServerReachable ? 'Server reachable' : 'Unreachable'}</Text>
      <Button
        title="Log out"
        onPress={() => {
          logout().catch(console.log);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.BACKGROUND,
  },
});
