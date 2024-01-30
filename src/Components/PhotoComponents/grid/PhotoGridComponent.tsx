import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { appColors } from '~/styles/colors';

import FlatListWithColumns from './FlatListWithColumns';
import PhotoComponentForGrid from './PhotoComponentForGrid';

const NUM_COLUMNS = 3;

function keyExtractor(item: PhotoGalleryType) {
  return `grid_${item.key}`;
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

function correctIndexFromScrollPosition(scrollPosition: number, len: number) {
  let tmp = Math.floor(scrollPosition / NUM_COLUMNS);
  if (scrollPosition >= len) {
    tmp = Math.floor((len - 1) / NUM_COLUMNS);
  }

  if (tmp < 0) {
    tmp = 0;
  }
  return tmp;
}

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
  photosLenRef.current = photos.length;
  const correctStartIndex = correctIndexFromScrollPosition(scrollPosition, photos.length);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // don't scroll if no photos yet
    if (photosLenRef.current > 0) {
      flatlistRef.current?.scrollToIndex({ index: correctStartIndex });
    }
  }, [flatlistRef, correctStartIndex]);

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

  return (
    <View style={[styles.mainViewStyle, { paddingTop: insets.top }]}>
      <FlatListWithColumns
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
        columns={NUM_COLUMNS}
      />
      <TabBarPadding />
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewStyle: {
    height: '100%',
    width: '100%',
    backgroundColor: appColors.BACKGROUND,
  },
  flatListStyle: {},
});
