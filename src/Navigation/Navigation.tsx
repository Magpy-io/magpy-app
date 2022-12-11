import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PhotoGalleryServerScreen from "~/Navigation/Screens/PhotoGalleryServerScreen";
import PhotoGalleryLocalScreen from "~/Navigation/Screens/PhotoGalleryLocalScreen";

const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="Page1">
      <Stack.Screen
        name="Page1"
        component={PhotoGalleryServerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Page2"
        component={PhotoGalleryLocalScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
