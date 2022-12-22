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
const TEXT_SIZE = 12;
const TOOLBAR_COLOR = "white";
const TOOL_COLOR = "black";

type ToolComponentProps = {
  icon: string;
  text?: string;
  textSize?: number;
};

function ToolComponent(props: ToolComponentProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        // justifyContent: "center",
      }}
    >
      <Icon
        name={props.icon}
        color={TOOL_COLOR}
        size={ICON_SIZE}
        containerStyle={styles.iconContainerStyle}
      />
      {props.text ? (
        <Text
          style={{
            color: TOOL_COLOR,
            paddingTop: 2,
            maxWidth: 70,
            fontSize: props.textSize ?? TEXT_SIZE,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {props.text}
        </Text>
      ) : null}
    </View>
  );
}

function ToolBar(props: ToolBarProps) {
  return (
    <View style={styles.toolBarView}>
      <View style={styles.toolsView}>
        <ToolComponent
          icon="mobile-off"
          text="Delete from device"
          textSize={10}
        />
        <ToolComponent icon="delete" text="Delete" />
        <ToolComponent icon="share" text="Share" />
        <ToolComponent icon="info" text="Details" />
      </View>
    </View>
  );
}

function BackButton() {
  return (
    <View style={styles.backButtonStyle}>
      <Icon
        name="arrow-back-ios"
        color={"black"}
        size={22}
        style={styles.backIconStyle}
      />
    </View>
  );
}

function StatusComponent(props: { icon: string; text: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.lightgrey,
        padding: 5,
        borderRadius: 20,
        marginHorizontal: 3,
      }}
    >
      <Icon name={props.icon} containerStyle={{ padding: 5 }} size={20} />
      <Text style={{ paddingHorizontal: 3, fontWeight: "700" }}>
        {props.text}
      </Text>
    </View>
  );
}

function StatusBarComponent() {
  return (
    <View style={styles.statusBarComponentStyle}>
      <StatusComponent icon="mobile-friendly" text="On device" />
      <StatusComponent icon="cloud-done" text="Backed up" />
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
      <StatusBarComponent />
      <ToolBar />
    </View>
  );
}

const styles = StyleSheet.create({
  statusBarComponentStyle: {
    margin: 20,
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
  },
  backIconStyle: {
    padding: 15,
  },
  backButtonStyle: {
    margin: 10,
    position: "absolute",
    top: 0,
    left: 0,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: "white",
  },
  toolBarView: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    paddingHorizontal: 0,
  },
  toolsView: {
    backgroundColor: TOOLBAR_COLOR,
    padding: 10,
    borderRadius: 50,
    flex: 1,
    flexDirection: "row",
  },
  iconContainerStyle: {},
});
