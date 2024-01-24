import React from 'react';
import { View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PhotoGalleryLocalScreenTab from '../Screens/TabMainScreens/PhotoGalleryLocalScreenTab';
import PhotoGalleryServerScreenTab from '../Screens/TabMainScreens/PhotoGalleryServerScreenTab';
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
  return (
    <View style={{ flex: 1 }}>
      <TabStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <TabStack.Screen name={TabName.Home} component={PhotoGalleryLocalScreenTab} />
        <TabStack.Screen name={TabName.Server} component={PhotoGalleryServerScreenTab} />
        <TabStack.Screen name={TabName.Settings} component={SettingsScreenTab} />
      </TabStack.Navigator>
      <TabBar />
    </View>
  );
}
