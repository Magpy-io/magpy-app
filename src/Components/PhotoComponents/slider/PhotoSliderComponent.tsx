import React, { useCallback, useImperativeHandle, useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, ViewToken } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { clamp } from '~/Helpers/Utilities';

import PhotoComponentForSlider from './PhotoComponentForSlider';

const ITEM_WIDTH = Dimensions.get('window').width;

function getItemLayout(data: ArrayLike<PhotoGalleryType> | null | undefined, index: number) {
  return {
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  };
}

export type PhotoSliderComponentRefType = {
  scrollToIndex: (params: { index: number; animated?: boolean }) => void;
};

type PropsType = {
  photos: PhotoGalleryType[];
  isFullScreen: boolean;
  onIndexChanged?: (index: number) => void;
  onPhotoClick?: (item: PhotoGalleryType) => void;
  onPhotoLongClick?: (item: PhotoGalleryType) => void;
};

const PhotoSliderComponent = React.forwardRef(function PhotoSliderComponent(
  { onIndexChanged, onPhotoClick, onPhotoLongClick, photos, isFullScreen }: PropsType,
  ref: React.ForwardedRef<PhotoSliderComponentRefType>,
) {
  const flatlistRef = useRef<FlatList>(null);

  const photosLen = photos.length;

  useImperativeHandle(ref, () => {
    return {
      scrollToIndex(params) {
        if (photosLen <= 0) {
          return;
        }
        const indexClamped = clamp(params.index, photosLen - 1);

        onIndexChanged?.(indexClamped);

        flatlistRef.current?.scrollToIndex({
          index: indexClamped,
          animated: false,
        });
      },
    };
  }, [onIndexChanged, photosLen]);

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
      windowSize={5}
      initialNumToRender={1}
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
      onEndReachedThreshold={5}
      getItemLayout={getItemLayout}
    />
  );
});

const styles = StyleSheet.create({
  flatListStyle: { width: '100%' },
});

export default React.memo(PhotoSliderComponent);
