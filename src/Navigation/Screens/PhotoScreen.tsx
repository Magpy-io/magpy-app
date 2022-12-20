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

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PhotoStackParamList } from "../Navigation";

type PropsPhotoScreen = NativeStackScreenProps<
  PhotoStackParamList,
  "PhotoPage"
>;

export default function PhotoScreen(propss: PropsPhotoScreen) {
  const params = propss.route.params;
  console.log("params", params);
  return (
    <SafeAreaView>
      <Image
        source={{ uri: params.uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}
