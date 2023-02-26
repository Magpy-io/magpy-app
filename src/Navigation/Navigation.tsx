import React from "react";
import { Dimensions } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import TopTabBar from "~/Navigation/TopTabBar";
import { createDrawerNavigator } from "@react-navigation/drawer";
//Screens
import PhotoGalleryServerScreen from "~/Navigation/Screens/PhotoGalleryServerScreen";
import PhotoGalleryLocalScreen from "~/Navigation/Screens/PhotoGalleryLocalScreen";
import TestScreen from "~/Navigation/Screens/Test";

import type { NavigatorScreenParams } from "@react-navigation/native";

const Drawer = createDrawerNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Local"
      >
        <Drawer.Screen name="Local" component={PhotoGalleryLocalScreen} />
        <Drawer.Screen name="Server" component={PhotoGalleryServerScreen} />
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
