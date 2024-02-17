import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { SectionList, StyleSheet, TouchableHighlight, View } from 'react-native';

import { Text } from 'react-native-elements';

import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
} from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useTheme } from '~/Context/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { DayType, getIndexInSectionList, getPhotosPerDay } from './Helpers';
import PhotoComponentForGrid from './PhotoComponentForGrid';
import SectionListWithColumns, { NewSection } from './SectionListWithColumns';

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
  onSelectPhotoGroup: (items: PhotoGalleryType[]) => void;
};

export default function PhotoGridComponent({
  photos,
  onLongPressPhoto,
  onPressPhoto,
  currentPhotoIndex,
  onRefresh,
  isSelecting,
  selectedKeys,
  onSelectPhotoGroup,
}: PhotoGridComponentProps) {
  const sectionlistRef = useRef<SectionList>(null);
  const photosLenRef = useRef<number>(photos.length);
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

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

  const renderSectionHeader = ({ section }: { section: NewSection }) => {
    const photos = section.data.flat();
    return (
      <View style={styles.sectionHeaderStyle}>
        <Text style={styles.headerTitleStyle}>{section.title}</Text>
        {isSelecting && (
          <TouchableHighlight
            style={styles.headerButtonStyle}
            onPress={() => {
              onSelectPhotoGroup(photos);
            }}
            underlayColor={colors.UNDERLAY}>
            <Text style={styles.headerButtonTextStyle}>Select all</Text>
          </TouchableHighlight>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.mainViewStyle, { backgroundColor: colors.BACKGROUND }]}>
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

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    sectionHeaderStyle: {
      height: SECTION_HEADER_HEIGHT,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitleStyle: {
      paddingTop: spacing.spacing_xxs,
      paddingLeft: spacing.spacing_m,
      ...typography(colors).largeText,
    },
    headerButtonStyle: {
      paddingVertical: spacing.spacing_xxs,
      paddingHorizontal: spacing.spacing_m,
      borderRadius: borderRadius.button,
    },
    headerButtonTextStyle: {
      ...typography(colors).mediumTextBold,
    },
    mainViewStyle: {
      flex: 1,
    },
  });
