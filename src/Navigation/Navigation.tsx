import React from "react";
import { Dimensions } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import TopTabBar from "~/Navigation/TopTabBar";

//Screens
import PhotoGalleryServerScreen from "~/Navigation/Screens/PhotoGalleryServerScreen";
import PhotoGalleryLocalScreen from "~/Navigation/Screens/PhotoGalleryLocalScreen";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();
const TabInitialLayout = {
  width: Dimensions.get("window").width,
};
const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="ServerPage"
        initialLayout={TabInitialLayout}
        tabBar={(props) => <TopTabBar {...props} />}
      >
        <Tab.Screen name="ServerPage" component={PhotoGalleryServerScreen} />
        <Tab.Screen name="LocalPage" component={PhotoGalleryLocalScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
