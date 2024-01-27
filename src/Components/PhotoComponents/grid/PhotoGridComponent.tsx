import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';

import PhotoComponentForGrid from './PhotoComponentForGrid';

const ITEM_HEIGHT = Dimensions.get('screen').width / 3;

function keyExtractor(item: PhotoGalleryType) {
  return `grid_${item.key}`;
}

function getItemLayout(data: ArrayLike<PhotoGalleryType> | null | undefined, index: number) {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
}

type PhotoGridComponentProps = {
  photos: Array<PhotoGalleryType>;
  onPressPhoto: (item: PhotoGalleryType) => void;
  onLongPressPhoto: (item: PhotoGalleryType) => void;
  scrollPosition: number;
  onRefresh: () => void;
  isSelecting: boolean;
  selectedIds: Map<string, PhotoGalleryType>;
};

export default function PhotoGridComponent({
  photos,
  onLongPressPhoto,
  onPressPhoto,
  scrollPosition,
  onRefresh,
  isSelecting,
  selectedIds,
}: PhotoGridComponentProps) {
  const flatlistRef = useRef<FlatList>(null);
  const photosLenRef = useRef<number>(photos.length);
  const insets = useSafeAreaInsets();

  photosLenRef.current = photos.length;

  const renderItem = useCallback(
    ({ item }: { item: PhotoGalleryType }) => {
      return (
        <PhotoComponentForGrid
          photo={item}
          isSelecting={isSelecting}
          isSelected={selectedIds.has(item.key)}
          onPress={onPressPhoto}
          onLongPress={onLongPressPhoto}
        />
      );
    },
    [onLongPressPhoto, onPressPhoto, isSelecting, selectedIds],
  );

  let correctStartIndex = Math.floor(scrollPosition / 3);

  if (scrollPosition >= photos.length) {
    correctStartIndex = Math.floor((photos.length - 1) / 3);
  }

  if (correctStartIndex < 0) {
    correctStartIndex = 0;
  }

  useEffect(() => {
    // don't scroll if no photos yet
    if (photosLenRef.current > 0) {
      flatlistRef.current?.scrollToIndex({ index: correctStartIndex });
    }
  }, [flatlistRef, correctStartIndex]);

  // TODO change the numColumns to 1 and create a renderItem containing 3 photos
  // This will fix a bug in flatlist which makes it recreate all items each time one is added or removed from the top (indexes change for the rest)
  // with numColumns set to 1, this problem is fixed and the items are able to rerender as needed
  // This will also fix that when less than 3 photos are in a row, the 2 or 1 photo will stretch to fill all horizontal space.
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.mainViewStyle, { paddingTop: insets.top }]}>
      <FlatList
        ref={flatlistRef}
        style={styles.flatListStyle}
        data={photos}
        renderItem={renderItem}
        windowSize={3}
        maxToRenderPerBatch={1}
        initialNumToRender={1}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={1}
        onRefresh={onRefresh}
        refreshing={false}
        numColumns={3}
        getItemLayout={getItemLayout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewStyle: {
    height: '100%',
    width: '100%',
  },
  flatListStyle: {},
});
