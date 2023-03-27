import { StyleSheet, Text, View, TouchableHighlight } from "react-native";

import { Icon } from "@rneui/themed";
import colors from "~/colors";
import React from "react";

const ICON_SIZE = 20;
const TEXT_SIZE = 10;
const TOOLBAR_COLOR = "#ffffff";
const TOOL_COLOR = "#4d4d4d";

type ToolBarProps = {
  style?: any;
  contextLocation: string;
  onDeleteLocal?: () => void;
  onAddLocal?: () => void;
  onDeleteServer?: () => void;
  onAddServer?: () => void;
  onShare?: () => void;
  onDetails?: () => void;
};

function ToolBarGrid(props: ToolBarProps) {
  return (
    <View style={[styles.toolBarView, props.style]}>
      <View style={styles.toolsView}>
        {props.contextLocation == "local" ? (
          <ToolComponent
            icon="backup"
            text="Back up"
            onPress={() => props.onAddServer?.()}
          />
        ) : (
          <ToolComponent
            icon="system-update"
            text="Save to device"
            onPress={() => props.onAddLocal?.()}
          />
        )}
        <ToolComponent
          icon="mobile-off"
          text="Delete from device"
          onPress={() => props.onDeleteLocal?.()}
        />
        <ToolComponent
          icon="share"
          text="Share"
          onPress={() => props.onShare?.()}
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
        paddingVertical: 8,
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
    position: "absolute",
    bottom: 0,
  },
  toolsView: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: TOOLBAR_COLOR,
  },
  iconContainerStyle: {},
});

export default React.memo(ToolBarGrid);
