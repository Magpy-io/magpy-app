import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screens from "~/Components/Screens";
import PhotoGalleryServer from "~/Components/PhotoGalleryServer";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Screens />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: "white",
  },
});
