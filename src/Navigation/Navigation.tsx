import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { TabNavigationProvider } from '~/Navigation/TabNavigation/TabNavigationContext';

import { Root } from './Root';

const Navigation = () => {
  const { dark } = useTheme();

  return (
    <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
      <TabNavigationProvider>
        <Root />
      </TabNavigationProvider>
    </NavigationContainer>
  );
};

export default Navigation;
