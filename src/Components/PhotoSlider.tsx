import {
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  BackHandler,
} from "react-native";

import { useCallback, useEffect, useState } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoComponentForSlider from "./PhotoComponentForSlider";

const ITEM_WIDTH = Dimensions.get("window").width;

type PropsType = {
  photos: PhotoType[];
  onSwitchMode: (index: number) => void;
  onEndReached: () => void;
  startIndex: number;
  title?: string;
  onPhotoClicked?: (photo: PhotoType) => void;
};

export default function PhotoGrid(props: PropsType) {
  console.log("PhotoSlider: Render");
  const PhotoPressed = props.onPhotoClicked ?? ((photo: PhotoType) => {});

  const renderItem = useCallback(
    ({ item, index }: { item: PhotoType; index: number }) => (
      <PhotoComponentForSlider
        photo={item}
        onPress={() => PhotoPressed(props.photos[index])}
        index={index}
      />
    ),
    [props.photos]
  );

  useEffect(() => {
    const backAction = () => {
      props.onSwitchMode(0);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <FlatList
      style={styles.flatListStyle}
      data={props.photos}
      renderItem={renderItem}
      initialNumToRender={20}
      initialScrollIndex={props.startIndex}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 90,
      }}
      horizontal={true}
      snapToAlignment="start"
      disableIntervalMomentum={true}
      decelerationRate={"normal"}
      showsHorizontalScrollIndicator={false}
      snapToInterval={Dimensions.get("screen").width}
      keyExtractor={(item, index) =>
        `Photo_${item.image.fileName}_index_${index}`
      }
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        console.log("PhotoSlider: onEndReached");
        props.onEndReached();
      }}
      getItemLayout={(data, index) => ({
        length: ITEM_WIDTH,
        offset: ITEM_WIDTH * index,
        index,
      })}
      ListHeaderComponent={() =>
        props.title ? (
          <Text style={styles.titleStyle}>{props.title}</Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    color: "grey",
    paddingBottom: 15,
  },
  flatListStyle: {},
});
