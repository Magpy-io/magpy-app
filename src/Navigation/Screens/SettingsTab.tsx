import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-elements';

import { useAuthContext } from '~/Context/AuthContext';
import { useServerContext } from '~/Context/ServerContext';

export default function App() {
  const { logout, user } = useAuthContext();
  const { isServerReachable } = useServerContext();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
});
