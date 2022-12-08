import React, { type PropsWithChildren } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import PhotoGalleryServer from "~/Components/PhotoGalleryServer";
import PhotoGallery from "~/Components/PhotoGallery";

const App = () => {
  return (
    <SafeAreaView style={styles.viewStyle}>
      <PhotoGalleryServer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default App;
