import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, ViewToken } from 'react-native';

import { PhotoType } from '~/Helpers/types';

import PhotoComponentForSlider from './PhotoComponentForSlider';

const ITEM_WIDTH = Dimensions.get('window').width;

function keyExtractor(item: PhotoType, index: number) {
  return `Photo_${item.image.fileName}_index_${index}`;
}

function getItemLayout(data: ArrayLike<PhotoType> | null | undefined, index: number) {
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
  onPhotoClick?: (item: PhotoType) => void;
  onPhotoLongClick?: (item: PhotoType) => void;
};

function PhotoSliderCore({
  onIndexChanged,
  onPhotoClick,
  onPhotoLongClick,
  startIndex,
  photos,
  ...props
}: PropsType) {
  const flatlistRef = useRef<FlatList>(null);
  const flatListCurrentIndexRef = useRef<number>(startIndex);

  const renderItem = useCallback(
    ({ item }: { item: PhotoType; index: number }) => (
      <PhotoComponentForSlider
        photo={item}
        onPress={onPhotoClick}
        onLongPress={onPhotoLongClick}
      />
    ),
    [onPhotoClick, onPhotoLongClick],
  );

  let correctStartIndex = startIndex;

  if (startIndex >= photos.length) {
    correctStartIndex = photos.length - 1;
  }

  if (correctStartIndex < 0) {
    correctStartIndex = 0;
  }

  const onFlatListCurrentIndexChanged = useCallback(
    (index: number) => {
      onIndexChanged?.(index);
    },
    [onIndexChanged],
  );

  const onViewableItemsChangedCallBack = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      if (viewableItems.length == 1) {
        const index = viewableItems[0].index ?? 0;
        flatListCurrentIndexRef.current = index;
        onFlatListCurrentIndexChanged(index);
      }
    },
    [onFlatListCurrentIndexChanged],
  );

  useEffect(() => {
    if (photos.length == 0) {
      return;
    }
    const indexOutOfRange = flatListCurrentIndexRef.current >= photos.length || startIndex < 0;

    let indexToScroll = flatListCurrentIndexRef.current;

    if (flatListCurrentIndexRef.current < 0) {
      indexToScroll = 0;
    }

    if (flatListCurrentIndexRef.current >= photos.length) {
      indexToScroll = photos.length - 1;
    }

    if (indexOutOfRange) {
      flatlistRef.current?.scrollToIndex({
        animated: false,
        index: indexToScroll,
      });
    }
  }, [photos.length, startIndex]);

  const startIndexOutOfRange = startIndex >= photos.length;

  useEffect(() => {
    if (startIndexOutOfRange) {
      return;
    }
    flatlistRef.current?.scrollToIndex({
      animated: false,
      index: startIndex,
    });
  }, [startIndexOutOfRange, startIndex]);

  return (
    <FlatList
      style={styles.flatListStyle}
      ref={flatlistRef}
      data={photos}
      renderItem={renderItem}
      initialNumToRender={10}
      initialScrollIndex={correctStartIndex}
      onViewableItemsChanged={onViewableItemsChangedCallBack}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 90,
      }}
      horizontal={true}
      snapToAlignment="start"
      disableIntervalMomentum={true}
      decelerationRate={'normal'}
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
  flatListStyle: { width: '100%' },
});

export default PhotoSliderCore;
