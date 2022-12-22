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

type PropsPhotoScreen = NativeStackScreenProps<
  PhotoStackParamList,
  "PhotoPage"
>;

type ToolBarProps = {};

const ICON_SIZE = 26;

type ToolComponentProps = {
  icon: string;
  text?: string;
};

function ToolComponent(props: ToolComponentProps) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Icon
        name={props.icon}
        color="white"
        size={ICON_SIZE}
        containerStyle={styles.iconContainerStyle}
      />
      {props.text ? <Text style={{ color: "white" }}>{props.text}</Text> : null}
    </View>
  );
}

function ToolBar(props: ToolBarProps) {
  return (
    <View style={styles.toolBarView}>
      <View style={styles.toolsView}>
        <ToolComponent icon="mobile-off" text="delete" />
        <ToolComponent icon="delete" text="delete" />

        <ToolComponent icon="share" text="delete" />

        <ToolComponent icon="more-vert" />
      </View>
    </View>
  );
}

function BackButton() {
  return (
    <View style={styles.backButtonStyle}>
      <Icon
        name="arrow-back-ios"
        reverse
        color={colors.darkGreenTranslucide}
        size={22}
        style={styles.backIconStyle}
      />
    </View>
  );
}

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
      <BackButton />
      <ToolBar />
    </View>
  );
}

const styles = StyleSheet.create({
  backIconStyle: {
    paddingLeft: 0,
  },
  backButtonStyle: {
    margin: 10,
    position: "absolute",
    top: 0,
    left: 0,
  },
  viewStyle: {
    flex: 1,
  },
  toolBarView: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingHorizontal: 30,
  },
  toolsView: {
    backgroundColor: colors.greenTranslucide,
    padding: 15,
    borderRadius: 30,
    flex: 1,
    flexDirection: "row",
  },
  iconContainerStyle: {
    flex: 1,
  },
});
