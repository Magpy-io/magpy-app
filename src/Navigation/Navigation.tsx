import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'react-native-elements';

import { useAuthContext } from '~/Context/AuthContext';
import { useServerClaimContext } from '~/Context/ServerClaimContext';
import LoginScreen from '~/Navigation/Screens/LoginScreen';
import PhotoGalleryLocalScreen from '~/Navigation/Screens/PhotoGalleryLocalScreen';
import PhotoGalleryServerScreen from '~/Navigation/Screens/PhotoGalleryServerScreen';
import ServerSelectScreen from '~/Navigation/Screens/ServerSelectScreen';
import TestScreen from '~/Navigation/Screens/Test';
import { appColors, colors } from '~/styles/colors';

import { LoginStackParamList } from './NavigationParams';
import RegisterScreen from './Screens/RegisterScreen';
import SplashScreen from './Screens/SplashScreen';

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

const HomeStack = createNativeStackNavigator();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="Local" component={PhotoGalleryLocalScreen} />
      <HomeStack.Screen name="RegisterScreen" component={RegisterScreen} />
    </HomeStack.Navigator>
  );
}

const ServerStack = createNativeStackNavigator();
function ServerStackNavigator() {
  return (
    <ServerStack.Navigator screenOptions={{ headerShown: false }}>
      <ServerStack.Screen name="ServerScreen" component={PhotoGalleryServerScreen} />
    </ServerStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();
function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <SettingsStack.Screen name="Test" component={TestScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home-outline';
          if (route.name === 'Home') {
            iconName = focused ? 'home-sharp' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings-sharp' : 'settings-outline';
          } else if (route.name === 'Server') {
            iconName = focused ? 'server-sharp' : 'server-outline';
          }
          return <Icon name={iconName} type="ionicon" size={size} color={color} />;
        },
        tabBarActiveTintColor: appColors.PRIMARY,
        tabBarInactiveTintColor: colors.LIGHT_GREEN,
        tabBarStyle: { height: 120, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 10, paddingBottom: 12, fontWeight: 'bold' },
        headerShown: false,
      })}>
      <Tab.Screen name="Server" component={ServerStackNavigator} />
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
}

const AuthenticatedNavigator = () => {
  const { hasServer } = useServerClaimContext();
  if (hasServer) {
    return <TabNavigator />;
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
      <Root />
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
