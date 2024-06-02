import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '~/Context/Contexts/ThemeContext';

import ServerSelectScreen from '../Screens/ServerSelectScreen';

const Stack = createNativeStackNavigator();

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
    </Stack.Navigator>
  );
}
