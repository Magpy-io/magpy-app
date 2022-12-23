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
import colors from "~/colors";

const ICON_SIZE = 26;
const TEXT_SIZE = 12;
const TOOLBAR_COLOR = "white";
const TOOL_COLOR = "black";

type ToolBarProps = {};

export default function ToolBar(props: ToolBarProps) {
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

const styles = StyleSheet.create({
  toolBarView: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    paddingHorizontal: 0,
    backgroundColor: "white",
  },
  toolsView: {
    backgroundColor: TOOLBAR_COLOR,
    padding: 5,
    borderRadius: 50,
    flex: 1,
    flexDirection: "row",
  },
  iconContainerStyle: {},
});
