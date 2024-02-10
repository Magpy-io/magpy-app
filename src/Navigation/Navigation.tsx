import React from 'react';
import { useColorScheme } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { TabNavigationProvider } from '~/Navigation/TabNavigation/TabNavigationContext';

import { MainStackParamList } from './Navigators/MainStackNavigator';
import { Root } from './Root';

const Navigation = () => {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TabNavigationProvider>
        <Root />
      </TabNavigationProvider>
    </NavigationContainer>
  );
};

export function useMainNavigation() {
  return useNavigation<StackNavigationProp<MainStackParamList>>();
}

export default Navigation;
