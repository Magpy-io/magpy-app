import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";

import { Icon } from "@rneui/themed";
import colors from "~/colors";
import { PhotoType } from "~/Helpers/types";
import { postPhoto } from "~/Helpers/Queries";
import RNFS from "react-native-fs";

const ICON_SIZE = 26;
const TEXT_SIZE = 12;
const TOOLBAR_COLOR = "white";
const TOOL_COLOR = "black";

type ToolBarProps = {
  photo: PhotoType;
  style?: any;
};

function postPhotoMethod(photo: PhotoType) {
  RNFS.readFile(photo.image.path, "base64")
    .then((res: string) => {
      postPhoto({
        name: photo.image.fileName,
        fileSize: photo.image.fileSize,
        width: photo.image.width,
        height: photo.image.height,
        date: new Date(photo.created).toJSON(),
        path: photo.image.path,
        image64: res,
      });
    })
    .catch((err: any) => console.log(err));
}

export default function ToolBar(props: ToolBarProps) {
  const inDevice = props?.photo?.inDevice;
  const inServer = props?.photo?.inServer;

  function deleteFromDevice(photo: PhotoType) {}

  function deleteFromServer(photo: PhotoType) {}

  function saveToDevice(photo: PhotoType) {}

  function addToServer(photo: PhotoType) {
    postPhotoMethod(photo);
  }

  return (
    <View style={[styles.toolBarView, props.style]}>
      <View style={styles.toolsView}>
        {inDevice ? (
          <ToolComponent
            icon="mobile-off"
            text="Delete from device"
            onPress={() => deleteFromDevice(props.photo)}
          />
        ) : (
          <ToolComponent
            icon="system-update"
            text="Save to device"
            onPress={() => saveToDevice(props.photo)}
          />
        )}
        {inServer ? (
          <ToolComponent
            icon="delete"
            text="Delete from server"
            onPress={() => deleteFromServer(props.photo)}
          />
        ) : (
          <ToolComponent
            icon="backup"
            text="Back up"
            onPress={() => addToServer(props.photo)}
          />
        )}
        <ToolComponent icon="share" text="Share" onPress={() => {}} />
        <ToolComponent icon="info" text="Details" onPress={() => {}} />
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

function ToolComponent(props: ToolComponentProps) {
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
}

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
