import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createDrawerNavigator } from "@react-navigation/drawer";
//Screens
import PhotoGalleryServerScreen from "~/Navigation/Screens/PhotoGalleryServerScreen";
import PhotoGalleryLocalScreen from "~/Navigation/Screens/PhotoGalleryLocalScreen";
import TestScreen from "~/Navigation/Screens/Test";
import ServerSelectScreen from "~/Navigation/Screens/ServerSelectScreen";

import type { NavigatorScreenParams } from "@react-navigation/native";

const Drawer = createDrawerNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="ServerSelectScreen"
      >
        <Drawer.Screen name="Server" component={PhotoGalleryServerScreen} />
        <Drawer.Screen name="Local" component={PhotoGalleryLocalScreen} />
        <Drawer.Screen
          name="ServerSelectScreen"
          component={ServerSelectScreen}
        />
        <Drawer.Screen name="Test" component={TestScreen} />
      </Drawer.Navigator>
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
