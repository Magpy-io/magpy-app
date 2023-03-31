import { StyleSheet, FlatList, Dimensions, ViewToken } from "react-native";

import React, { useCallback, useEffect, useRef } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoComponentForSlider from "./PhotoComponentForSlider";

const ITEM_WIDTH = Dimensions.get("screen").width;

function keyExtractor(item: PhotoType, index: number) {
  return `Photo_${item.image.fileName}_index_${index}`;
}

function getItemLayout(data: any, index: number) {
  return {
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  };
}

type PropsType = {
  photos: PhotoType[];
  startIndex: number;
  onIndexChanged?: (index: number) => void;
  onEndReached?: () => void;
  onPhotoClick?: (item: PhotoType, index: number) => void;
  onPhotoLongClick?: (item: PhotoType, index: number) => void;
};

function PhotoSliderCore(props: PropsType) {
  const flatlistRef = useRef<FlatList>(null);
  const flatListCurrentIndexRef = useRef<number>(props.startIndex);

  const renderItem = useCallback(
    ({ item, index }: { item: PhotoType; index: number }) => (
      <PhotoComponentForSlider
        photo={item}
        index={index}
        onPress={props.onPhotoClick}
        onLongPress={props.onPhotoLongClick}
      />
    ),
    [props.onPhotoClick, props.onPhotoLongClick]
  );

  let correctStartIndex = props.startIndex;

  if (props.startIndex >= props.photos.length) {
    correctStartIndex = props.photos.length - 1;
  }

  if (props.startIndex < 0) {
    correctStartIndex = 0;
  }

  const onFlatListCurrentIndexChanged = useCallback(
    (index: number) => {
      props.onIndexChanged?.(index);
    },
    [props.onIndexChanged]
  );

  const onViewableItemsChangedCallBack = useCallback(
    ({
      viewableItems,
      changed,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (viewableItems.length == 1) {
        const index = viewableItems[0].index ?? 0;
        flatListCurrentIndexRef.current = index;
        onFlatListCurrentIndexChanged(index);
      }
    },
    []
  );

  useEffect(() => {
    if (props.photos.length == 0) {
      return;
    }
    const indexOutOfRange =
      flatListCurrentIndexRef.current >= props.photos.length ||
      props.startIndex < 0;

    let indexToScroll = flatListCurrentIndexRef.current;

    if (flatListCurrentIndexRef.current < 0) {
      indexToScroll = 0;
    }

    if (flatListCurrentIndexRef.current >= props.photos.length) {
      indexToScroll = props.photos.length - 1;
    }

    if (indexOutOfRange) {
      flatlistRef.current?.scrollToIndex({
        animated: false,
        index: indexToScroll,
      });
    }
  }, [props.photos.length, props.startIndex]);

  const startIndexOutOfRange = props.startIndex >= props.photos.length;

  useEffect(() => {
    if (startIndexOutOfRange) {
      return;
    }
    flatlistRef.current?.scrollToIndex({
      animated: false,
      index: props.startIndex,
    });
  }, [startIndexOutOfRange, props.startIndex]);

  return (
    <FlatList
      style={styles.flatListStyle}
      ref={flatlistRef}
      data={props.photos}
      renderItem={renderItem}
      initialNumToRender={1}
      initialScrollIndex={correctStartIndex}
      onViewableItemsChanged={onViewableItemsChangedCallBack}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 90,
      }}
      horizontal={true}
      snapToAlignment="start"
      disableIntervalMomentum={true}
      decelerationRate={"normal"}
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={5}
      onEndReached={props.onEndReached}
      getItemLayout={getItemLayout}
    />
  );
}

const styles = StyleSheet.create({
  flatListStyle: {},
});

export default PhotoSliderCore;
