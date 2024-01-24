import React from 'react';
import { StyleSheet } from 'react-native';

import { Button, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthContext, useAuthFunctions } from '~/Context/UseContexts/useAuthContext';
import { useServerContext } from '~/Context/UseContexts/useServerContext';

import { useMainNavigation } from '../Navigation';

export default function App() {
  const { user } = useAuthContext();
  const { logout } = useAuthFunctions();
  const { isServerReachable } = useServerContext();
  const navigation = useMainNavigation();

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
