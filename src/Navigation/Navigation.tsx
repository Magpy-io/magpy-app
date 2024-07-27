import React from 'react';
import { useColorScheme } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import { TabNavigationProvider } from '~/Navigation/TabNavigation/TabNavigationContext';

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

export default Navigation;
