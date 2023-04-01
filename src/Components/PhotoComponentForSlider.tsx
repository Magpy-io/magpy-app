import React, { useMemo } from "react";
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
  index: number;
  onPress?: (item: PhotoType, index: number) => void;
  onLongPress?: (item: PhotoType, index: number) => void;
};

function PhotoComponentForSlider(props: PropsType) {
  console.log("render photo for slider", props.photo.id);

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

  return (
    <TouchableWithoutFeedback
      onPress={() => props.onPress?.(props.photo, props.index)}
      onLongPress={() => props.onLongPress?.(props.photo, props.index)}
    >
      <View style={styles.itemStyle}>
        <FastImage
          source={{ uri: uriSource }}
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
