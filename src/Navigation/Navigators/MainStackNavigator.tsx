import React from 'react';

import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '~/Context/Contexts/ThemeContext';

import AboutSettingsScreen from '../Screens/AboutSettingsScreen';
import AccountSettingsScreen from '../Screens/AccountSettingsScreen';
import BackupSettingsScreen from '../Screens/BackupSettingsScreen';
import DebugScreen from '../Screens/DebugScreen';
import LoginScreen from '../Screens/LoginScreen';
import PreferencesSettingsScreen from '../Screens/PreferencesSettingsScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import ServerClaimScreen from '../Screens/ServerClaimScreen';
import ServerGalleryScreen from '../Screens/ServerGalleryScreen';
import ServerLoginScreen from '../Screens/ServerLoginScreen';
import ServerManualAddressScreen from '../Screens/ServerManualAddressScreen';
import ServerSelectScreen from '../Screens/ServerSelectScreen';
import { WelcomeScreen } from '../Screens/WelcomeScreen';
import { TabStackNavigator, TabStackParamList } from './TabStackNavigator';

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabStackParamList> | undefined;
  ServerGalleryScreen: undefined;
  ServerSelect: undefined;
  ServerManualAddress: undefined;
  ServerClaim: undefined;
  ServerLogin: undefined;
  Login: undefined;
  Register: undefined;
  AccountSettings: undefined;
  BackupSettings: undefined;
  PreferencesSettings: undefined;
  AboutSettings: undefined;
  Debug: undefined;
  Welcome: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

type propsType = {
  initialScreen?: keyof MainStackParamList | undefined;
};

export function MainStackNavigator({ initialScreen }: propsType) {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        navigationBarColor: colors.BACKGROUND,
      }}
      initialRouteName={initialScreen ?? 'Login'}>
      <Stack.Screen name="Tabs" component={TabStackNavigator} />
      <Stack.Screen name="ServerGalleryScreen" component={ServerGalleryScreen} />
      <Stack.Screen name="ServerSelect" component={ServerSelectScreen} />
      <Stack.Screen name="ServerManualAddress" component={ServerManualAddressScreen} />
      <Stack.Screen name="ServerClaim" component={ServerClaimScreen} />
      <Stack.Screen name="ServerLogin" component={ServerLoginScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="BackupSettings" component={BackupSettingsScreen} />
      <Stack.Screen name="PreferencesSettings" component={PreferencesSettingsScreen} />
      <Stack.Screen name="AboutSettings" component={AboutSettingsScreen} />
      <Stack.Screen name="Debug" component={DebugScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
}

export function useMainStackNavigation() {
  return useNavigation<StackNavigationProp<MainStackParamList>>();
}
