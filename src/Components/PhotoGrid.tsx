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

type PhotoComponentProps = {
  uri: string;
  onPress: () => void;
};

function PhotoComponent(props: PhotoComponentProps) {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props?.onPress();
        /*navigation.navigate('PhotoStackNavigator', { screen: 'PhotoPage', params: {
        uri: props.uri
      }});*/
      }}
    >
      <View style={styles.itemStyle}>
        <FastImage
          source={{
            uri: props.uri,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={[styles.imageStyle]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

type PhotoGridProps = {
  uris?: Array<{ uri: string; url: string }>;
  title?: string;
  onPhotoClicked?: (index: number) => void;
};

export default function PhotoGrid(props: PhotoGridProps) {
  const PhotoPressed = props.onPhotoClicked
    ? props.onPhotoClicked
    : (n: number) => {};

  useEffect(() => {}, []);

  console.log("Render PhotoGrid");

  return (
    <View style={styles.viewStyle}>
      <FlatList
        style={styles.flatListStyle}
        data={props.uris}
        renderItem={({ item, index }) => (
          <PhotoComponent uri={item.uri} onPress={() => PhotoPressed(index)} />
          //<Text style={styles.itemStyle}>{"Hello"}</Text>
        )}
        maxToRenderPerBatch={500}
        initialNumToRender={500}
        keyExtractor={(item, i) => String(i)}
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
