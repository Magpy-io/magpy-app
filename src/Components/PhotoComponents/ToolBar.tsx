import { StyleSheet, Text, View, TouchableHighlight } from "react-native";

import { Icon } from "@rneui/themed";
import colors from "~/colors";
import { PhotoType } from "~/Helpers/types";
import React from "react";

const ICON_SIZE = 26;
const TEXT_SIZE = 12;
const TOOLBAR_COLOR = "white";
const TOOL_COLOR = "black";

type ToolBarProps = {
  inDevice: boolean;
  inServer: boolean;
  style?: any;
  onDeleteAddLocal?: () => void;
  onDeleteAddServer?: () => void;
  onShare?: () => void;
  onDetails?: () => void;
};

function ToolBar(props: ToolBarProps) {
  return (
    <View style={[styles.toolBarView, props.style]}>
      <View style={styles.toolsView}>
        {props.inDevice ? (
          <ToolComponent
            icon="mobile-off"
            text="Delete from device"
            onPress={() => props.onDeleteAddLocal?.()}
          />
        ) : (
          <ToolComponent
            icon="system-update"
            text="Save to device"
            onPress={() => props.onDeleteAddLocal?.()}
          />
        )}
        {props.inServer ? (
          <ToolComponent
            icon="delete"
            text="Delete from server"
            onPress={() => props.onDeleteAddServer?.()}
          />
        ) : (
          <ToolComponent
            icon="backup"
            text="Back up"
            onPress={() => props.onDeleteAddServer?.()}
          />
        )}
        <ToolComponent
          icon="share"
          text="Share"
          onPress={() => props.onShare?.()}
        />
        <ToolComponent
          icon="info"
          text="Details"
          onPress={() => props.onDetails?.()}
        />
      </View>
    </View>
  );
}

type ToolComponentProps = {
  icon: string;
  text?: string;
  textSize?: number;
  onPress: () => void;
};

const ToolComponent = React.memo((props: ToolComponentProps) => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={{
        flex: 1,
        padding: 5,
        paddingVertical: 20,
      }}
      underlayColor={colors.underlayColor}
    >
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
    </TouchableHighlight>
  );
});

const styles = StyleSheet.create({
  toolBarView: {
    width: "100%",
    backgroundColor: "transparent",
  },
  toolsView: {
    flex: 1,
    flexDirection: "row",
  },
  iconContainerStyle: {},
});

export default React.memo(ToolBar);
