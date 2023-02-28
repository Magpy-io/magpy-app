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
  onPress: () => void;
  index: number;
};

export default function PhotoComponentForSlider(props: PropsType) {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props?.onPress();
      }}
    >
      <View style={styles.itemStyle}>
        <FastImage
          source={{
            uri: props.photo.inDevice
              ? props.photo.image.path
              : props.photo.image.image64,
          }}
          resizeMode={FastImage.resizeMode.contain}
          style={[styles.imageStyle]}
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
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
});
