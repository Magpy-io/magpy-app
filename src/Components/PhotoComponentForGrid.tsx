import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";

import FastImage from "react-native-fast-image";

import { PhotoType } from "~/Helpers/types";

type PropsType = {
  photo: PhotoType;
  onPress: () => void | undefined;
  onLongPress: () => void | undefined;
  index: number;
};

export default function PhotoComponentForGrid(props: PropsType) {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props?.onPress();
      }}
      onLongPress={() => {
        props?.onLongPress();
      }}
    >
      <View style={styles.itemStyle}>
        <FastImage
          source={{
            uri: props.photo.inDevice
              ? props.photo.image.path
              : props.photo.image.image64,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={[styles.imageStyle]}
        />
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
  },
});
