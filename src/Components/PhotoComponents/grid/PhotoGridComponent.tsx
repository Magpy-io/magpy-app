import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

import { Text } from 'react-native-elements';

import { GroupOptionSelector } from '~/Context/ReduxStore/Slices/GalleryOptions/Selectors';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useTheme } from '~/Context/ThemeContext';
import { clamp } from '~/Helpers/Utilities';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import SectionListWithColumns, {
  SectionListWithColumnsRefType,
} from '../../CommonComponents/SectionListWithColumns/SectionListWithColumns';
import PhotoComponentForGrid from './PhotoComponentForGrid';
import { KeysSelection } from './useKeysSelection';
import { getGridNumberOfColumns } from './usePhotosGrouped/Helpers';
import { SectionTypePhotoGrid, usePhotosGrouped } from './usePhotosGrouped/usePhotosGrouped';

function keyExtractor(item: PhotoGalleryType) {
  return `grid_${item.key}`;
}

type PhotoGridComponentProps = {
  photos: Array<PhotoGalleryType>;
  onPressPhoto: (item: PhotoGalleryType) => void;
  onLongPressPhoto: (item: PhotoGalleryType) => void;
  currentPhotoIndex: number;
  onRefresh: () => void;
  isSelecting: boolean;
  photosSelection: KeysSelection;
};

export default function PhotoGridComponent({
  photos,
  onLongPressPhoto,
  onPressPhoto,
  currentPhotoIndex,
  onRefresh,
  isSelecting,
  photosSelection,
}: PhotoGridComponentProps) {
  const sectionlistRef = useRef<SectionListWithColumnsRefType>(null);
  const photosLenRef = useRef<number>(photos.length);
  photosLenRef.current = photos.length;

  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  const groupType = useAppSelector(GroupOptionSelector);

  const numberOfColumns = getGridNumberOfColumns(groupType);
  const { sections, indexToSectionLocation } = usePhotosGrouped(photos, groupType);

  const currentPhotoIndexClamped = clamp(currentPhotoIndex, photos.length - 1);
  const currentPhoto = photos[currentPhotoIndexClamped];

  const { sectionIndex, itemIndex } = indexToSectionLocation(currentPhoto);

  useEffect(() => {
    if (photosLenRef.current > 0 && sectionIndex >= 0 && itemIndex >= 0) {
      sectionlistRef.current?.scrollToLocation({
        sectionIndex: sectionIndex,
        itemIndex: itemIndex,
        animated: true,
      });
    }
  }, [sectionlistRef, sectionIndex, itemIndex]);

  const renderItem = useCallback(
    ({ item }: { item: PhotoGalleryType }) => {
      return (
        <PhotoComponentForGrid
          photo={item}
          isSelecting={isSelecting}
          isSelected={photosSelection.isSelected(item)}
          onPress={onPressPhoto}
          onLongPress={onLongPressPhoto}
        />
      );
    },
    [onLongPressPhoto, onPressPhoto, isSelecting, photosSelection],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionTypePhotoGrid }) => {
      return (
        <View style={styles.sectionHeaderStyle}>
          <Text style={styles.headerTitleStyle}>{section.sectionData.getTitle()}</Text>
          {isSelecting && (
            <TouchableHighlight
              style={styles.headerButtonStyle}
              onPress={() => {
                photosSelection.selectGroup(section.data);
              }}
              underlayColor={colors.UNDERLAY}>
              <Text style={styles.headerButtonTextStyle}>Select all</Text>
            </TouchableHighlight>
          )}
        </View>
      );
    },
    [colors, styles, isSelecting, photosSelection],
  );

  return (
    <View style={[styles.mainViewStyle, { backgroundColor: colors.BACKGROUND }]}>
      <SectionListWithColumns
        mref={sectionlistRef}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        numberColumns={numberOfColumns}
        itemSpacing={SPACE_BETWEEN_PHOTOS}
        sectionHeaderHeight={SECTION_HEADER_HEIGHT}
        onRefresh={onRefresh}
        refreshing={false}
      />
    </View>
  );
}

const SECTION_HEADER_HEIGHT = 60;
const SPACE_BETWEEN_PHOTOS = 1;

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
