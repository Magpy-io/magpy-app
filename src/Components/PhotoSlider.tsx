import {
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  BackHandler,
  ViewToken,
} from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";
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

  const flatListCurrentIndexRef = useRef(0);

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
      props.onSwitchMode(flatListCurrentIndexRef.current);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const onViewableItemsChangedCallBack = useCallback(
    ({
      viewableItems,
      changed,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (viewableItems.length == 1) {
        flatListCurrentIndexRef.current = viewableItems[0].index ?? 0;
        console.log(flatListCurrentIndexRef.current);
      }
    },
    [flatListCurrentIndexRef]
  );

  return (
    <FlatList
      style={styles.flatListStyle}
      data={props.photos}
      renderItem={renderItem}
      initialNumToRender={20}
      initialScrollIndex={props.startIndex}
      onViewableItemsChanged={onViewableItemsChangedCallBack}
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
      onEndReachedThreshold={5}
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
