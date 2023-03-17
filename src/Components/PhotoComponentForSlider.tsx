import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

import FastImage from "react-native-fast-image";

import { PhotoType } from "~/Helpers/types";

type PropsType = {
  photo: PhotoType;
  onPress?: () => void;
  onLongPress?: () => void;
};

function PhotoComponentForSlider(props: PropsType) {
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
          resizeMode={FastImage.resizeMode.contain}
          style={styles.imageStyle}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    padding: 1,
    justifyContent: "center",
    width: Dimensions.get("screen").width,
    backgroundColor: "white",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
    backgroundColor: "white",
  },
});

export default React.memo(PhotoComponentForSlider);
