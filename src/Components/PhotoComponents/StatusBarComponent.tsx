import { StyleSheet, Text, View } from "react-native";

import { Icon } from "@rneui/themed";
import colors from "~/colors";
import BackButton from "../CommonComponents/BackButton";
import React from "react";

type StatusBarComponentProps = {
  inDevice: boolean;
  inServer: boolean;
  style?: any;
  onBackButton?: () => void;
};

function StatusBarComponent(props: StatusBarComponentProps) {
  const deviceStatusText = props.inDevice ? "On device" : "Not on device";
  const serverStatusText = props.inServer ? "Backed up" : "Not backed up";

  const deviceStatusIcon = props.inDevice
    ? "mobile-friendly"
    : "phonelink-erase";
  const serverStatusIcon = props.inServer ? "cloud-done" : "cloud-off";

  return (
    <View style={[styles.StatusBarStyle, props.style]}>
      <View style={styles.statusBarBackButtonStyle}>
        <BackButton onPress={props.onBackButton} />
      </View>
      <View style={styles.statusBarComponentStyle}>
        <StatusComponent
          icon={deviceStatusIcon}
          text={deviceStatusText}
          valid={props.inDevice}
        />
        <StatusComponent
          icon={serverStatusIcon}
          text={serverStatusText}
          valid={props.inServer}
        />
      </View>
    </View>
  );
}

type StatusComponentProps = {
  icon: string;
  text: string;
  valid: boolean;
};

const VALID_COLOR = colors.success;
const VALID_BACKGROUND_COLOR = colors.lightSuccess;
const INVALID_COLOR = "black";
const INVALID_BACKGROUND_COLOR = colors.greyBackgroundColor;

const StatusComponent = React.memo((props: StatusComponentProps) => {
  return (
    <View
      style={[
        styles.statusComponentStyle,
        {
          padding: 5,
          backgroundColor: props.valid
            ? VALID_BACKGROUND_COLOR
            : INVALID_BACKGROUND_COLOR,
        },
      ]}
    >
      <Icon
        name={props.icon}
        containerStyle={{}}
        size={15}
        color={props.valid ? VALID_COLOR : INVALID_COLOR}
      />
      <Text
        style={{
          fontWeight: "bold",
          color: props.valid ? VALID_COLOR : INVALID_COLOR,
          fontSize: 15,
          marginLeft: 3,
        }}
      >
        {props.text}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  StatusBarStyle: {
    padding: 5,
    width: "100%",
    backgroundColor: "transparent",
    opacity: 0.6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBarBackButtonStyle: {},
  statusBarComponentStyle: {
    flexDirection: "row",
  },
  statusComponentStyle: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 3,
    marginHorizontal: 3,
  },
});

export default React.memo(StatusBarComponent);
