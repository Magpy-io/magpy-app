import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, ViewToken } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { clamp } from '~/Helpers/Utilities';

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
  currentPhotoIndex: number;
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
  currentPhotoIndex,
  isFullScreen,
}: PropsType) {
  const flatlistRef = useRef<FlatList>(null);

  const flatListCurrentIndexRef = useRef<number>(currentPhotoIndex);
  flatListCurrentIndexRef.current = currentPhotoIndex;
  const hasPhotos = photos && photos.length > 0;

  useEffect(() => {
    if (hasPhotos) {
      const indexToScroll = clamp(flatListCurrentIndexRef.current, photos.length - 1);

      flatListCurrentIndexRef.current = indexToScroll;

      flatlistRef.current?.scrollToIndex({
        index: indexToScroll,
        animated: false,
      });
    }
  }, [hasPhotos, photos.length, currentPhotoIndex]);

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
