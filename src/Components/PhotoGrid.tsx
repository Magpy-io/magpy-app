import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

import FastImage from "react-native-fast-image";
import { Image } from "react-native-elements";
import { Button, Overlay } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Photo as PhotoType } from "~/Helpers/types";

type PhotoComponentProps = {
  photo: PhotoType;
  onPress: () => void;
};

function PhotoComponent(props: PhotoComponentProps) {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // props?.onPress();
        navigation.navigate("PhotoStackNavigator", {
          screen: "PhotoPage",
          params: {
            photo: props.photo,
          },
        });
      }}
    >
      <View style={styles.itemStyle}>
        <FastImage
          source={{
            uri: props.photo.image.base64
              ? props.photo.image.base64
              : props.photo.image.path,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={[styles.imageStyle]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

type PhotoGridProps = {
  photos?: Array<PhotoType>;
  title?: string;
  onPhotoClicked?: (index: number) => void;
};

export default function PhotoGrid(props: PhotoGridProps) {
  const PhotoPressed = props.onPhotoClicked
    ? props.onPhotoClicked
    : (n: number) => {};

  console.log("Render PhotoGrid");

  return (
    <View style={styles.viewStyle}>
      <FlatList
        style={styles.flatListStyle}
        data={props.photos}
        renderItem={({ item, index }) => (
          <PhotoComponent photo={item} onPress={() => PhotoPressed(index)} />
        )}
        maxToRenderPerBatch={500}
        initialNumToRender={500}
        keyExtractor={(item, index) =>
          `Photo_${item.image.fileName}_index_${index}`
        }
        numColumns={3}
        ListHeaderComponent={() =>
          props.title ? (
            <Text style={styles.titleStyle}>{props.title}</Text>
          ) : null
        }
      />
    </View>
  );
}

const MARGIN = 1;
const BORDER_RADIUS = 0;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    color: "grey",
    paddingBottom: 15,
  },
  viewStyle: {
    flex: 1,
    margin: MARGIN,
  },
  flatListStyle: {},
  itemStyle: {
    padding: MARGIN,
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
  },
  itemTextStyle: { textAlign: "center" },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: BORDER_RADIUS,
  },
  imageContainerStyle: { overflow: "hidden" },
});
