import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
} from '~/Context/ReduxStore/Slices/Photos';
import { appColors } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { DayType, getIndexInSectionList, getPhotosPerDay } from './Helpers';
import PhotoComponentForGrid from './PhotoComponentForGrid';
import SectionListWithColumns from './SectionListWithColumns';

const NUM_COLUMNS = 3;
const SECTION_HEADER_HEIGHT = 60;
const SPACE_BETWEEN_PHOTOS = 1;

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
  <View style={styles.sectionHeaderStyle}>
    <Text style={styles.headerTitleStyle}>{title}</Text>
  </View>
);

export default function PhotoGridComponent({
  photos,
  onLongPressPhoto,
  onPressPhoto,
  currentPhotoIndex,
  onRefresh,
  isSelecting,
  selectedKeys,
}: PhotoGridComponentProps) {
  const sectionlistRef = useRef<SectionList>(null);
  const photosLenRef = useRef<number>(photos.length);

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
    return getPhotosPerDay(photos);
  }, [photos]);

  const { sectionIndex, rowIndex } = useMemo(() => {
    if (photosPerDayMemo && photosPerDayMemo.length > 0) {
      return getIndexInSectionList(currentPhotoIndex, photosPerDayMemo, photos, NUM_COLUMNS);
    }
    return { sectionIndex: 0, rowIndex: 0 };
  }, [currentPhotoIndex, photos, photosPerDayMemo]);

  useEffect(() => {
    if (photosLenRef.current > 0 && sectionIndex >= 0 && rowIndex >= 0) {
      sectionlistRef.current?.scrollToLocation({
        sectionIndex: sectionIndex,
        itemIndex: rowIndex,
        animated: true,
      });
    }
  }, [sectionlistRef, sectionIndex, rowIndex]);

  return (
    <View style={[styles.mainViewStyle]}>
      <SectionListWithColumns
        ref={sectionlistRef}
        sections={photosPerDayMemo}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        columns={NUM_COLUMNS}
        separatorSpace={SPACE_BETWEEN_PHOTOS}
        sectionHeaderHeight={SECTION_HEADER_HEIGHT}
        onRefresh={onRefresh}
        refreshing={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeaderStyle: {
    height: SECTION_HEADER_HEIGHT,
    justifyContent: 'center',
  },
  headerTitleStyle: {
    paddingTop: spacing.spacing_s,
    paddingLeft: spacing.spacing_m,
    ...typography.largeText,
  },
  mainViewStyle: {
    backgroundColor: appColors.BACKGROUND,
    flex: 1,
  },
});
