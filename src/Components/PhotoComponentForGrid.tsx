import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { Icon } from "@rneui/themed";

import FastImage from "react-native-fast-image";

import { PhotoType } from "~/Helpers/types";

import * as Progress from "react-native-progress";

type PropsType = {
  photo: PhotoType;
  isSelecting: boolean;
  isSelected: boolean;
  onPress?: (item: PhotoType) => void;
  onLongPress?: (item: PhotoType) => void;
};

function PhotoComponentForGrid(props: PropsType) {
  //console.log("render photo for grid", props.photo.id);
  const uriSource = useMemo(() => {
    if (props.photo.inDevice) {
      return props.photo.image.path;
    } else {
      if (props.photo.image.pathCache) {
        return props.photo.image.pathCache;
      } else {
        return props.photo.image.image64;
      }
    }
  }, [props.photo]);

  const onPress = useMemo(() => {
    if (props.onPress) {
      return props.onPress;
    } else {
      return (item: PhotoType) => {};
    }
  }, [props.onPress]);

  const onLongPress = useMemo(() => {
    if (props.onLongPress) {
      return props.onLongPress;
    } else {
      return (item: PhotoType) => {};
    }
  }, [props.onLongPress]);

  return (
    <TouchableWithoutFeedback
      onPress={() => onPress(props.photo)}
      onLongPress={() => onLongPress(props.photo)}
    >
      <View style={styles.itemStyle}>
        <FastImage
          source={{ uri: uriSource }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.imageStyle}
        />
        {props.photo.isLoading && (
          <View style={styles.pieViewStyle}>
            <Progress.Circle
              style={styles.pieStyle}
              progress={props.photo.loadingPercentage}
              size={60}
              borderColor={"#000000a0"}
              color={"#000000a0"}
              thickness={8}
              indeterminate={props.photo.loadingPercentage == 0}
            />
          </View>
        )}
        {props.isSelecting && (
          <View style={styles.iconViewStyle}>
            {props.isSelected ? (
              <Icon
                style={styles.iconStyle}
                name="check-circle"
                size={35}
                color="#39a5f7"
              />
            ) : (
              <Icon
                style={styles.iconStyle}
                name="radio-button-unchecked"
                size={35}
                color="white"
              />
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    padding: 1,
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
    position: "absolute",
  },
  pieViewStyle: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff50",
    position: "absolute",
  },
  pieStyle: {},
  iconViewStyle: {
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
  },
  iconStyle: { margin: 5 },
});

export default React.memo(PhotoComponentForGrid);
