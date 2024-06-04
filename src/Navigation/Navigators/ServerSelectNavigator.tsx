import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '~/Context/Contexts/ThemeContext';

import ServerClaimScreen from '../Screens/ServerSelectNavigation/ServerClaimScreen';
import ServerSelectScreen from '../Screens/ServerSelectNavigation/ServerSelectScreen';

export type ServerSelectStackParamList = {
  ServerSelect: undefined;
  ServerRegister: undefined;
};

const Stack = createNativeStackNavigator<ServerSelectStackParamList>();

export function ServerSelectNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        navigationBarColor: colors.BACKGROUND,
      }}>
      <Stack.Screen name="ServerSelect" component={ServerSelectScreen} />
      <Stack.Screen name="ServerRegister" component={ServerClaimScreen} />
    </Stack.Navigator>
  );
}
