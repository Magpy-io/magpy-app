import React, { useCallback, useMemo, useRef } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
  PhotosLocalType,
  PhotosServerType,
} from '~/Context/ReduxStore/Slices/Photos';
import { areDatesEqual, withoutTime } from '~/Helpers/Date';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { appColors } from '~/styles/colors';

import { getPhotoServerOrLocal } from './Helpers';
import PhotoComponentForGrid from './PhotoComponentForGrid';
import SectionListWithColumns from './SectionListWithColumns';

const NUM_COLUMNS = 3;

type DayType = {
  title: string;
  day: string;
  data: PhotoGalleryType[];
};

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

function getClosestPhotoToIndex(currentPhotoIndex: number, photos: PhotoGalleryType[]) {
  const len = photos.length;
  if (currentPhotoIndex >= len) {
    return photos[len - 1];
  }
  return photos[currentPhotoIndex];
}

function getIndexInSectionList(
  currentPhotoIndex: number,
  photosPerDayMemo: DayType[],
  localPhotos: PhotosLocalType,
  serverPhotos: PhotosServerType,
  photos: PhotoGalleryType[],
) {
  const currentPhoto = getClosestPhotoToIndex(currentPhotoIndex, photos);
  const currentPhotoData = getPhotoServerOrLocal(localPhotos, serverPhotos, currentPhoto);
  const currentPhotoDate = withoutTime(currentPhotoData.created);
  const sectionIndex = photosPerDayMemo.findIndex(e => e.day === currentPhotoDate);
  const itemIndex = photosPerDayMemo[sectionIndex]?.data.findIndex(
    e => e.key === currentPhoto.key,
  );
  const rowIndex = Math.floor(itemIndex / NUM_COLUMNS);
  console.log('getIndexInSectionList', sectionIndex, itemIndex, rowIndex);
  return {
    sectionIndex: sectionIndex,
    rowIndex: rowIndex,
  };
}

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
  console.log('currentPhotoIndex', currentPhotoIndex);
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
    if (photos && photos.length > 0) {
      const photosPerDay: DayType[] = [];

      let currentDate = withoutTime(photos[0]?.date) ?? '';
      let currentBasket: DayType = {
        title: currentDate,
        day: currentDate,
        data: [],
      };

      photos.forEach(photo => {
        const photoDate = withoutTime(photo.date) ?? '';

        if (areDatesEqual(photoDate, currentDate)) {
          currentBasket.data.push(photo);
        } else {
          photosPerDay.push(currentBasket);
          currentDate = photoDate;
          currentBasket = {
            title: photoDate,
            day: photoDate,
            data: [photo],
          };
        }
      });
      return photosPerDay;
    } else {
      return [];
    }
  }, [photos]);

  const indexInSectionList = useMemo(() => {
    if (photosPerDayMemo && photosPerDayMemo.length > 0) {
      return getIndexInSectionList(
        currentPhotoIndex,
        photosPerDayMemo,
        localPhotos,
        serverPhotos,
        photos,
      );
    }
    return { sectionIndex: 0, rowIndex: 0 };
  }, [currentPhotoIndex, localPhotos, photos, photosPerDayMemo, serverPhotos]);

  // useEffect(() => {
  //   if (
  //     indexInSectionList &&
  //     indexInSectionList.sectionIndex >= 0 &&
  //     indexInSectionList.rowIndex >= 0
  //   ) {
  //     console.log('indexInSectionList', indexInSectionList);
  //     sectionlistRef.current?.scrollToLocation({
  //       sectionIndex: indexInSectionList.sectionIndex,
  //       itemIndex: indexInSectionList.rowIndex,
  //     });
  //   }
  // }, [sectionlistRef, indexInSectionList]);

  return (
    <View style={[styles.mainViewStyle, { paddingTop: insets.top }]}>
      {/* <FlatListWithColumns
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
      /> */}
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
