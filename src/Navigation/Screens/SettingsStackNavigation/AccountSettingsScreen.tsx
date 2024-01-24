import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

export default function AccountSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Account settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: 'white',
  },
});
