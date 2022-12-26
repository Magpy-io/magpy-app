import React from "react";
import { Dimensions } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import TopTabBar from "~/Navigation/TopTabBar";

//Screens
import PhotoGalleryServerScreen from "~/Navigation/Screens/PhotoGalleryServerScreen";
import PhotoGalleryLocalScreen from "~/Navigation/Screens/PhotoGalleryLocalScreen";
import PhotoScreen from "~/Navigation/Screens/PhotoScreen";

import type { NavigatorScreenParams } from "@react-navigation/native";
import { Photo as PhotoType } from "~/Helpers/types";

const TabInitialLayout = {
  width: Dimensions.get("window").width,
};

const PhotoStack = createNativeStackNavigator();
function PhotoStackNavigator() {
  return (
    <PhotoStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PhotoStack.Screen name="PhotoPage" component={PhotoScreen} />
    </PhotoStack.Navigator>
  );
}

const ServerStack = createNativeStackNavigator();
function ServerPhotosStackNavigator() {
  return (
    <ServerStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ServerStack.Screen
        name="ServerPage"
        component={PhotoGalleryServerScreen}
      />
    </ServerStack.Navigator>
  );
}

const LocalStack = createNativeStackNavigator();
function LocalPhotosStackNavigator() {
  return (
    <LocalStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <LocalStack.Screen name="LocalPage" component={PhotoGalleryLocalScreen} />
    </LocalStack.Navigator>
  );
}

const Tab = createMaterialTopTabNavigator();
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="top"
      initialRouteName="LocalPhotosStackNavigator"
      initialLayout={TabInitialLayout}
      tabBar={(props) => <TopTabBar {...props} />}
      screenOptions={{
        swipeEnabled: false,
      }}
    >
      <Tab.Screen
        name="ServerPhotosStackNavigator"
        component={ServerPhotosStackNavigator}
      />
      <Tab.Screen
        name="LocalPhotosStackNavigator"
        component={LocalPhotosStackNavigator}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={LocalPhotosStackNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  PhotoStackNavigator: NavigatorScreenParams<PhotoStackParamList>;
};

export type HomeStackParamList = {
  ServerPhotosStackNavigator: NavigatorScreenParams<ServerStackParamList>;
  LocalPhotosStackNavigator: NavigatorScreenParams<LocalStackParamList>;
};

export type LocalStackParamList = {
  LocalPage: undefined;
};
export type ServerStackParamList = {
  ServerPage: undefined;
};
export type PhotoStackParamList = {
  PhotoPage: { photo: PhotoType };
};

export default Navigation;
