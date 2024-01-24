import React from 'react';
import { View } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuthContext } from '~/Context/UseContexts/useAuthContext';
import { useServerClaimContext } from '~/Context/UseContexts/useClaimServerContext';
import LoginScreen from '~/Navigation/Screens/LoginScreen';
import PhotoGalleryLocalScreen from '~/Navigation/Screens/PhotoGalleryLocalScreen';
import PhotoGalleryServerScreen from '~/Navigation/Screens/PhotoGalleryServerScreen';
import ServerSelectScreen from '~/Navigation/Screens/ServerSelectScreen';
import SettingsTab from '~/Navigation/Screens/SettingsTab';
import { TabName, TabNavigationProvider } from '~/Navigation/TabNavigationContext';

import {
  LoginStackParamList,
  ParentStackParamList,
  SettingsStackParamList,
  TabStackParamList,
} from './NavigationParams';
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

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
function SettingsStackNavigator() {
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

const TabStack = createNativeStackNavigator<TabStackParamList>();
function TabStackNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <TabStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <TabStack.Screen name={TabName.Home} component={PhotoGalleryLocalScreen} />
        <TabStack.Screen name={TabName.Server} component={PhotoGalleryServerScreen} />
        <TabStack.Screen name={TabName.Settings} component={SettingsTab} />
      </TabStack.Navigator>
      <TabBar />
    </View>
  );
}

const ParentStack = createNativeStackNavigator<ParentStackParamList>();
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

  if (loading) {
    return <SplashScreen />;
  }

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

export function useMainNavigation() {
  return useNavigation<StackNavigationProp<ParentStackParamList>>();
}

export default Navigation;
