import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountSettingsScreen from '../Screens/SettingsStackNavigation/AccountSettingsScreen';

export type SettingsStackParamList = {
  AccountSettings: undefined;
  ServerSettings: undefined;
};

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <SettingsStack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <SettingsStack.Screen name="ServerSettings" component={AccountSettingsScreen} />
    </SettingsStack.Navigator>
  );
}
