import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
} from "react-native";

import { Icon } from "@rneui/themed";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PhotoStackParamList } from "../Navigation";
import colors from "~/colors";
import ToolBar from "~/Components/PhotoComponents/ToolBar";
import StatusBarComponent from "~/Components/PhotoComponents/StatusBarComponent";
import BackButton from "~/Components/CommonComponents/BackButton";

type PropsPhotoScreen = NativeStackScreenProps<
  PhotoStackParamList,
  "PhotoPage"
>;

export default function PhotoScreen(props: PropsPhotoScreen) {
  const params = props.route.params;
  console.log("params", params);
  return (
    <View style={styles.viewStyle}>
      <Image
        source={{ uri: params.photo.image.path }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
      <View style={styles.topView} />
      <View style={styles.bottomView} />

      <BackButton />
      <StatusBarComponent />
      <ToolBar />
    </View>
  );
}

const styles = StyleSheet.create({
  topView: {
    position: "absolute",
    top: 0,
    height: 70,
    width: "100%",
    backgroundColor: "white",
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    height: 90,
    width: "100%",
    backgroundColor: "white",
  },
  viewStyle: {
    flex: 1,
    backgroundColor: "white",
  },
});
