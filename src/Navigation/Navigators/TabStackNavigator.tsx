import React, { useEffect } from 'react';
import { View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useMainContextFunctions } from '~/Context/Contexts/MainContext';

import HomeScreenTab from '../Screens/TabMainScreens/HomeScreenTab';
import ServerScreenTab from '../Screens/TabMainScreens/ServerScreenTab';
import SettingsScreenTab from '../Screens/TabMainScreens/SettingsScreenTab';
import TabBar from '../TabNavigation/TabBar';
import { TabName } from '../TabNavigation/TabNavigationContext';

export type TabStackParamList = {
  [TabName.Home]: undefined;
  [TabName.Server]: undefined;
  [TabName.Settings]: undefined;
};

const TabStack = createNativeStackNavigator<TabStackParamList>();
export function TabStackNavigator() {
  const { setIsNewUser } = useMainContextFunctions();

  useEffect(() => {
    setIsNewUser(false);
  }, [setIsNewUser]);

  return (
    <View style={{ flex: 1 }}>
      <TabStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName={TabName.Home}>
        <TabStack.Screen name={TabName.Server} component={ServerScreenTab} />
        <TabStack.Screen name={TabName.Home} component={HomeScreenTab} />
        <TabStack.Screen name={TabName.Settings} component={SettingsScreenTab} />
      </TabStack.Navigator>
      <TabBar />
    </View>
  );
}
