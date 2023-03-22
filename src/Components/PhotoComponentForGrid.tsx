import React, { useCallback } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";

import FastImage from "react-native-fast-image";

import { PhotoType } from "~/Helpers/types";

import * as Progress from "react-native-progress";

type PropsType = {
  photo: PhotoType;
  onPress?: () => void;
  onLongPress?: () => void;
};

function PhotoComponentForGrid(props: PropsType) {
  const chooseImageCallback = useCallback(() => {
    if (props.photo.inDevice) {
      return props.photo.image.path;
    } else {
      if (props.photo.image.image64Full) {
        return props.photo.image.image64Full;
      } else {
        return props.photo.image.image64;
      }
    }
  }, [props.photo]);

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      <View style={styles.itemStyle}>
        <FastImage
          source={{ uri: chooseImageCallback() }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.imageStyle}
        />
        {props.photo.isLoading ? (
          <View style={styles.pieViewStyle}>
            <Progress.Circle
              style={styles.pieStyle}
              progress={props.photo.loadingPercentage}
              size={60}
              borderColor={"#00000080"}
              color={"#00000080"}
              thickness={8}
            />
          </View>
        ) : (
          <></>
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
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  pieStyle: {},
});

export default React.memo(PhotoComponentForGrid);
