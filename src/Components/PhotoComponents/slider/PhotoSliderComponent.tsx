import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, ViewToken } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';

import PhotoComponentForSlider from './PhotoComponentForSlider';

const ITEM_WIDTH = Dimensions.get('window').width;

function keyExtractor(item: PhotoGalleryType) {
  return `Photo_${item.key}`;
}

function getItemLayout(data: ArrayLike<PhotoGalleryType> | null | undefined, index: number) {
  return {
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  };
}

type PropsType = {
  photos: PhotoGalleryType[];
  scrollPosition: number;
  isFullScreen: boolean;
  onIndexChanged?: (index: number) => void;
  onPhotoClick?: (item: PhotoGalleryType) => void;
  onPhotoLongClick?: (item: PhotoGalleryType) => void;
};

export default function PhotoSliderComponent({
  onIndexChanged,
  onPhotoClick,
  onPhotoLongClick,
  photos,
  scrollPosition,
  isFullScreen,
}: PropsType) {
  const flatlistRef = useRef<FlatList>(null);

  const flatListCurrentIndexRef = useRef<number>(scrollPosition);

  useEffect(() => {
    if (photos.length == 0) {
      return;
    }
    const indexOutOfRange =
      flatListCurrentIndexRef.current >= photos.length || scrollPosition < 0;

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
  }, [photos.length, scrollPosition]);

  const renderItem = useCallback(
    ({ item }: { item: PhotoGalleryType }) => (
      <PhotoComponentForSlider
        photo={item}
        onPress={onPhotoClick}
        onLongPress={onPhotoLongClick}
        isFullScreen={isFullScreen}
      />
    ),
    [isFullScreen, onPhotoClick, onPhotoLongClick],
  );

  const onViewableItemsChangedCallBack = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      if (viewableItems.length == 1) {
        const index = viewableItems[0].index ?? 0;
        flatListCurrentIndexRef.current = index;
        onIndexChanged?.(index);
      }
    },
    [onIndexChanged],
  );

  return (
    <FlatList
      style={styles.flatListStyle}
      ref={flatlistRef}
      data={photos}
      renderItem={renderItem}
      initialNumToRender={10}
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
      getItemLayout={getItemLayout}
    />
  );
}

const styles = StyleSheet.create({
  flatListStyle: { width: '100%' },
});
