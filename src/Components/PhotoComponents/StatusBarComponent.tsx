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
import colors from "~/colors";
import { Photo as PhotoType } from "~/Helpers/types";

type StatusBarComponentProps = {
  photo: PhotoType;
  style?: any;
};

export default function StatusBarComponent(props: StatusBarComponentProps) {
  const inDevice = props?.photo?.inDevice;
  const inServer = props?.photo?.inServer;

  const deviceStatusText = inDevice ? "On device" : "Not on device";
  const serverStatusText = inServer ? "Backed up" : "Not backed up";

  const deviceStatusIcon = inDevice ? "mobile-friendly" : "phonelink-erase";
  const serverStatusIcon = inServer ? "cloud-done" : "cloud-off";

  return (
    <>
      <View style={[styles.topView, props.style]} />

      <View style={[styles.statusBarComponentStyle, props.style]}>
        <StatusComponent
          icon={deviceStatusIcon}
          text={deviceStatusText}
          valid={inDevice}
        />
        <StatusComponent
          icon={serverStatusIcon}
          text={serverStatusText}
          valid={inServer}
        />
      </View>
    </>
  );
}

type StatusComponentProps = {
  icon: string;
  text: string;
  valid?: boolean | null;
};

const VALID_COLOR = colors.success;
const VALID_BACKGROUND_COLOR = colors.lightSuccess;
const INVALID_COLOR = "black";
const INVALID_BACKGROUND_COLOR = colors.greyBackgroundColor;
const BAR_HEIGHT = 70;

function StatusComponent(props: StatusComponentProps) {
  return (
    <View
      style={[
        styles.statusComponentStyle,
        {
          backgroundColor: props.valid
            ? VALID_BACKGROUND_COLOR
            : INVALID_BACKGROUND_COLOR,
        },
      ]}
    >
      <Icon
        name={props.icon}
        containerStyle={{ padding: 5 }}
        size={20}
        color={props.valid ? VALID_COLOR : INVALID_COLOR}
      />
      <Text
        style={{
          paddingHorizontal: 3,
          fontWeight: "bold",
          color: props.valid ? VALID_COLOR : INVALID_COLOR,
        }}
      >
        {props.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topView: {
    position: "absolute",
    top: 0,
    height: BAR_HEIGHT,
    width: "100%",
    backgroundColor: "white",
  },
  statusBarComponentStyle: {
    margin: 15,
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
  },
  statusComponentStyle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 20,
    marginHorizontal: 3,
  },
});
