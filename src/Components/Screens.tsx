import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PhotoGalleryServer from "~/Components/PhotoGalleryServer";
import PhotoGallery from "~/Components/PhotoGallery";

const Stack = createNativeStackNavigator();
const Screens = () => {
  return (
    <Stack.Navigator initialRouteName="Page1">
      <Stack.Screen name="Page1" component={PhotoGalleryServer} />
      <Stack.Screen name="Page2" component={PhotoGallery} />
    </Stack.Navigator>
  );
};

export default Screens;
