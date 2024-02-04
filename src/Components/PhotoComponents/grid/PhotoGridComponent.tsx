import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
} from '~/Context/ReduxStore/Slices/Photos';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { appColors } from '~/styles/colors';

import { DayType, getIndexInSectionList, getPhotosPerDay } from './Helpers';
import PhotoComponentForGrid from './PhotoComponentForGrid';
import SectionListWithColumns from './SectionListWithColumns';

const NUM_COLUMNS = 3;

function keyExtractor(item: PhotoGalleryType) {
  return `grid_${item.key}`;
}

type PhotoGridComponentProps = {
  photos: Array<PhotoGalleryType>;
  localPhotos: {
    [key: string]: PhotoLocalType;
  };
  serverPhotos: {
    [key: string]: PhotoServerType;
  };
  onPressPhoto: (item: PhotoGalleryType) => void;
  onLongPressPhoto: (item: PhotoGalleryType) => void;
  currentPhotoIndex: number;
  onRefresh: () => void;
  isSelecting: boolean;
  selectedKeys: Set<string>;
};

const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
  <View style={{ height: 30 }}>
    <Text>{title}</Text>
  </View>
);

export default function PhotoGridComponent({
  photos,
  localPhotos,
  serverPhotos,
  onLongPressPhoto,
  onPressPhoto,
  currentPhotoIndex,
  onRefresh,
  isSelecting,
  selectedKeys,
}: PhotoGridComponentProps) {
  const sectionlistRef = useRef<SectionList>(null);
  const photosLenRef = useRef<number>(photos.length);
  const insets = useSafeAreaInsets();

  photosLenRef.current = photos.length;
  const renderItem = useCallback(
    ({ item }: { item: PhotoGalleryType }) => {
      return (
        <PhotoComponentForGrid
          photo={item}
          isSelecting={isSelecting}
          isSelected={selectedKeys.has(item.key)}
          onPress={onPressPhoto}
          onLongPress={onLongPressPhoto}
        />
      );
    },
    [onLongPressPhoto, onPressPhoto, isSelecting, selectedKeys],
  );

  const photosPerDayMemo: DayType[] = useMemo(() => {
    return getPhotosPerDay(photos, localPhotos, serverPhotos);
  }, [localPhotos, photos, serverPhotos]);

  const indexInSectionList = useMemo(() => {
    if (photosPerDayMemo && photosPerDayMemo.length > 0) {
      return getIndexInSectionList(
        currentPhotoIndex,
        photosPerDayMemo,
        localPhotos,
        serverPhotos,
        photos,
        NUM_COLUMNS,
      );
    }
    return { sectionIndex: 0, rowIndex: 0 };
  }, [currentPhotoIndex, localPhotos, photos, photosPerDayMemo, serverPhotos]);

  useEffect(() => {
    if (
      photosPerDayMemo &&
      photosPerDayMemo.length > 0 &&
      indexInSectionList &&
      indexInSectionList.sectionIndex >= 0 &&
      indexInSectionList.rowIndex >= 0
    ) {
      console.log('indexInSectionList', indexInSectionList);
      sectionlistRef.current?.scrollToLocation({
        sectionIndex: indexInSectionList.sectionIndex,
        itemIndex: indexInSectionList.rowIndex,
      });
    }
  }, [sectionlistRef, indexInSectionList, photosPerDayMemo]);

  return (
    <View style={[styles.mainViewStyle, { paddingTop: insets.top }]}>
      <SectionListWithColumns
        ref={sectionlistRef}
        sections={photosPerDayMemo}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
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
