import React from 'react';
import { View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthContext } from '~/Context/AuthContext';
import { useServerClaimContext } from '~/Context/ServerClaimContext';
import { TabNavigationProvider } from '~/Context/TabNavigationContext';
import LoginScreen from '~/Navigation/Screens/LoginScreen';
import PhotoGalleryLocalScreen from '~/Navigation/Screens/PhotoGalleryLocalScreen';
import PhotoGalleryServerScreen from '~/Navigation/Screens/PhotoGalleryServerScreen';
import ServerSelectScreen from '~/Navigation/Screens/ServerSelectScreen';
import SettingsTab from '~/Navigation/Screens/SettingsTab';

import { LoginStackParamList } from './NavigationParams';
import AccountSettingsScreen from './Screens/AccountSettingsScreen';
import RegisterScreen from './Screens/RegisterScreen';
import SplashScreen from './Screens/SplashScreen';
import TabBar from './TabBar';

const LoginStack = createNativeStackNavigator<LoginStackParamList>();
function LoginStackNavigator() {
  return (
    <LoginStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <LoginStack.Screen name="Login" component={LoginScreen} />
      <LoginStack.Screen name="Register" component={RegisterScreen} />
    </LoginStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();
function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <SettingsStack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <SettingsStack.Screen name="ServerSettings" component={AccountSettingsScreen} />
      <SettingsStack.Screen name="Preferences" component={AccountSettingsScreen} />
    </SettingsStack.Navigator>
  );
}

export enum Tab {
  Server = 'Server',
  Home = 'Home',
  Settings = 'Settings',
}

const TabStack = createNativeStackNavigator();
function TabStackNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <TabStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <TabStack.Screen name={Tab.Home} component={PhotoGalleryLocalScreen} />
        <TabStack.Screen name={Tab.Server} component={PhotoGalleryServerScreen} />
        <TabStack.Screen name={Tab.Settings} component={SettingsTab} />
      </TabStack.Navigator>
      <TabBar />
    </View>
  );
}

const ParentStack = createNativeStackNavigator();
function ParentStackNavigator() {
  return (
    <ParentStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <ParentStack.Screen name="Tabs" component={TabStackNavigator} />
      <ParentStack.Screen name="SettingsStackNavigator" component={SettingsStackNavigator} />
    </ParentStack.Navigator>
  );
}

const AuthenticatedNavigator = () => {
  const { hasServer } = useServerClaimContext();
  if (hasServer) {
    return <ParentStackNavigator />;
  } else {
    return <ServerSelectScreen />;
  }
};

const Root = () => {
  const { token, loading } = useAuthContext();

  if (loading) return <SplashScreen />;
  if (!token) {
    return <LoginStackNavigator />;
  } else {
    return <AuthenticatedNavigator />;
  }
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <TabNavigationProvider>
        <Root />
      </TabNavigationProvider>
    </NavigationContainer>
  );
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<LocalStackParamList>;
};

export type LocalStackParamList = {
  LocalPage: undefined;
};

export default Navigation;
