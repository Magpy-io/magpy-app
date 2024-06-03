import React from 'react';

import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '~/Context/Contexts/ThemeContext';

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
  const { colors } = useTheme();
  return (
    <ParentStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        navigationBarColor: colors.BACKGROUND,
      }}>
      <ParentStack.Screen name="Tabs" component={TabStackNavigator} />
      <ParentStack.Screen name="SettingsStackNavigator" component={SettingsStackNavigator} />
      <ParentStack.Screen name="ServerGalleryScreen" component={ServerGalleryScreen} />
    </ParentStack.Navigator>
  );
}
