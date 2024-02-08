import React from 'react';

import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ServerGalleryScreen from '../Screens/ServerGalleryScreen';
import { SettingsStackNavigator, SettingsStackParamList } from './SettingsStackNavigator';
import { TabStackNavigator, TabStackParamList } from './TabStackNavigator';

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabStackParamList>;
  SettingsStackNavigator: NavigatorScreenParams<SettingsStackParamList>;
  ServerGalleryScreen: undefined;
};

const ParentStack = createNativeStackNavigator<MainStackParamList>();

export function MainStackNavigator() {
  return (
    <ParentStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <ParentStack.Screen name="Tabs" component={TabStackNavigator} />
      <ParentStack.Screen name="SettingsStackNavigator" component={SettingsStackNavigator} />
      <ParentStack.Screen name="ServerGalleryScreen" component={ServerGalleryScreen} />
    </ParentStack.Navigator>
  );
}
