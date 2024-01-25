import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, FlatList, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';

import PhotoComponentForGrid from './PhotoComponentForGrid';
import PhotoGridSelectView from './PhotoGridSelectView';

const ITEM_HEIGHT = Dimensions.get('screen').width / 3;

function keyExtractor(item: PhotoGalleryType) {
  return `grid_${item.uri}`;
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
  style?: StyleProp<ViewStyle>;
  onPressPhoto: (item: PhotoGalleryType) => void;
  onLongPressPhoto: (item: PhotoGalleryType) => void;
  initialScrollIndex: number;
  onRefresh: () => void;
  isSelecting: boolean;
  selectedIds: Map<string, PhotoGalleryType>;
  onSelectAll: () => void;
  onBackButton: () => void;
};

export default function PhotoGridComponent({
  photos,
  style,
  onLongPressPhoto,
  onPressPhoto,
  initialScrollIndex,
  onRefresh,
  isSelecting,
  selectedIds,
  onBackButton,
  onSelectAll,
}: PhotoGridComponentProps) {
  const flatlistRef = useRef<FlatList>(null);
  const photosLenRef = useRef<number>(photos.length);
  photosLenRef.current = photos.length;

  const renderItem = useCallback(
    ({ item }: { item: PhotoGalleryType }) => {
      return (
        <PhotoComponentForGrid
          key={`grid_${item.uri}`}
          photo={item}
          isSelecting={isSelecting}
          isSelected={selectedIds.has(item.uri)}
          onPress={onPressPhoto}
          onLongPress={onLongPressPhoto}
        />
      );
    },
    [onLongPressPhoto, onPressPhoto, isSelecting, selectedIds],
  );

  useEffect(() => {
    if (photosLenRef.current > 0) {
      flatlistRef.current?.scrollToIndex({ index: initialScrollIndex });
    }
  }, [flatlistRef, initialScrollIndex]);

  // TODO change the numColumns to 1 and create a renderItem containing 3 photos
  // This will fix a bug in flatlist which makes it recreate all items each time one is added or removed from the top (indexes change for the rest)
  // with numColumns set to 1, this problem is fixed and the items are able to rerender as needed
  // This will also fix that when less than 3 photos are in a row, the 2 or 1 photo will stretch to fill all horizontal space.

  return (
    <SafeAreaView edges={['top']} style={[styles.mainViewStyle, style]}>
      <FlatList
        ref={flatlistRef}
        style={styles.flatListStyle}
        data={photos}
        renderItem={renderItem}
        windowSize={3}
        maxToRenderPerBatch={1}
        initialNumToRender={1}
        initialScrollIndex={initialScrollIndex}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={1}
        //onEndReached={}
        onRefresh={onRefresh}
        refreshing={false}
        numColumns={3}
        getItemLayout={getItemLayout}
      />

      <PhotoGridSelectView
        onBackButton={onBackButton}
        onSelectAll={onSelectAll}
        isSelecting={isSelecting}
        selectedIds={selectedIds}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainViewStyle: {
    height: '100%',
    width: '100%',
  },
  flatListStyle: {},
});
