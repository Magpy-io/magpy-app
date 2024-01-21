import React from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthContext } from '~/Context/AuthContext';
import { useServerContext } from '~/Context/ServerContext';

export default function App() {
  const { logout, user } = useAuthContext();
  const { isServerReachable } = useServerContext();
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Account Settings"
        onPress={() =>
          navigation.navigate('SettingsStackNavigator', { screen: 'AccountSettings' })
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
