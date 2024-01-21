import React, { useCallback, useRef } from 'react';
import { Dimensions, FlatList, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoType } from '~/Helpers/types';

import PhotoComponentForGrid from './PhotoComponentForGrid';
import PhotoGridSelectView from './PhotoGridSelectView';

const ITEM_HEIGHT = Dimensions.get('screen').width / 3;

function keyExtractor(item: PhotoType) {
  return `grid_${item.id}`;
}

function getItemLayout(data: ArrayLike<PhotoType> | null | undefined, index: number) {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
}

type PhotoGridComponentProps = {
  photos: Array<PhotoType>;
  style?: StyleProp<ViewStyle>;
  onPressPhoto: (item: PhotoType) => void;
  onLongPressPhoto: (item: PhotoType) => void;
  initialScrollIndex: number;
  onRefresh: () => void;
  isSelecting: boolean;
  selectedIds: Map<string, PhotoType>;
  onAddLocal: () => void;
  onAddServer: () => void;
  onDeleteLocal: () => void;
  onDeleteServer: () => void;
  onSelectAll: () => void;
  onBackButton: () => void;
  contextLocation: string;
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
  onAddServer,
  onAddLocal,
  onDeleteLocal,
  onDeleteServer,
  onBackButton,
  onSelectAll,
  contextLocation,
}: PhotoGridComponentProps) {
  const flatlistRef = useRef<FlatList>(null);

  const renderItem = useCallback(
    ({ item }: { item: PhotoType }) => {
      return (
        <PhotoComponentForGrid
          key={`grid_${item.id}`}
          photo={item}
          isSelecting={isSelecting}
          isSelected={selectedIds.has(item.id)}
          onPress={onPressPhoto}
          onLongPress={onLongPressPhoto}
        />
      );
    },
    [onLongPressPhoto, onPressPhoto, isSelecting, selectedIds],
  );

  // TODO change the numColumns to 1 and create a renderItem containing 3 photos
  // This will fix a bug in flatlist which makes it recreate all items each time one is added or removed from the top (indexes change for the rest)
  // with numColumns set to 1, this problem is fixed and the items are able to rerender as needed
  // This will also fix that when less than 3 photos are in a row, the 2 or 1 photo will stretch to fill all horizontal space.

  return (
    <SafeAreaView style={[styles.mainViewStyle, style]}>
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
        contextLocation={contextLocation}
        onAddLocal={onAddLocal}
        onAddServer={onAddServer}
        onDeleteLocal={onDeleteLocal}
        onDeleteServer={onDeleteServer}
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
