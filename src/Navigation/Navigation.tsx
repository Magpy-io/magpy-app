import React from 'react';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { TabNavigationProvider } from '~/Navigation/TabNavigation/TabNavigationContext';

import { MainStackParamList } from './Navigators/MainStackNavigator';
import { Root } from './Root';

const Navigation = () => {
  return (
    <NavigationContainer>
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
