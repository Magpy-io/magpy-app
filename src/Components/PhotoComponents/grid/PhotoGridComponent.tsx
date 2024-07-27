import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { GroupOptionSelector } from '~/Context/ReduxStore/Slices/GalleryOptions/Selectors';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { clamp } from '~/Helpers/Utilities';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import SectionListWithColumns, {
  SectionListWithColumnsRefType,
} from '../../CommonComponents/SectionListWithColumns/SectionListWithColumns';
import PhotoComponentForGrid from './PhotoComponentForGrid';
import SelectedFilters from './SelectedFilters';
import { getGridNumberOfColumns } from './usePhotosGrouped/Helpers';
import { SectionTypePhotoGrid, usePhotosGrouped } from './usePhotosGrouped/usePhotosGrouped';

export type PhotoGridComponentRefType = {
  scrollToIndex: (params: { index: number; animated?: boolean }) => void;
};

type PhotoGridComponentProps = {
  photos: Array<PhotoGalleryType>;
  onPressPhoto: (item: PhotoGalleryType) => void;
  onLongPressPhoto: (item: PhotoGalleryType) => void;
  onRefresh: () => void;
  isSelecting: boolean;
  isSelected: (photo: PhotoGalleryType) => boolean;
  selectGroup: (photos: PhotoGalleryType[]) => void;
  ref: React.MutableRefObject<PhotoGridComponentRefType | null>;
};

const PhotoGridComponent = forwardRef(
  (
    {
      photos,
      onLongPressPhoto,
      onPressPhoto,
      onRefresh,
      isSelecting,
      isSelected,
      selectGroup,
    }: PhotoGridComponentProps,
    ref: React.ForwardedRef<PhotoGridComponentRefType>,
  ) => {
    const sectionlistRef = useRef<SectionListWithColumnsRefType>(null);

    const { colors } = useTheme();
    const styles = useStyles(makeStyles);

    const groupType = useAppSelector(GroupOptionSelector);

    const numberOfColumns = getGridNumberOfColumns(groupType);
    const { sections, indexToSectionLocation } = usePhotosGrouped(photos, groupType);

    useImperativeHandle(
      ref,
      () => {
        return {
          scrollToIndex(params) {
            if (photos.length <= 0) {
              return;
            }

            const indexClamped = clamp(params.index, photos.length - 1);
            const currentPhoto = photos[indexClamped];

            const { sectionIndex, itemIndex } = indexToSectionLocation(currentPhoto);

            sectionlistRef.current?.scrollToLocation({
              sectionIndex: sectionIndex,
              itemIndex: itemIndex,
              animated: params.animated,
            });
          },
        };
      },
      [indexToSectionLocation, photos],
    );

    const renderItem = useCallback(
      ({ item }: { item: PhotoGalleryType }) => {
        return (
          <PhotoComponentForGrid
            photo={item}
            isSelecting={isSelecting}
            isSelected={isSelected(item)}
            onPress={onPressPhoto}
            onLongPress={onLongPressPhoto}
          />
        );
      },
      [onLongPressPhoto, onPressPhoto, isSelecting, isSelected],
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
                  selectGroup(section.data);
                }}
                underlayColor={colors.UNDERLAY}>
                <Text style={styles.headerButtonTextStyle}>Select all</Text>
              </TouchableHighlight>
            )}
          </View>
        );
      },
      [colors, styles, isSelecting, selectGroup],
    );

    return (
      <View style={[styles.mainViewStyle, { backgroundColor: colors.BACKGROUND }]}>
        <SectionListWithColumns
          mref={sectionlistRef}
          sections={sections}
          renderItem={renderItem}
          ListHeaderComponent={SelectedFilters}
          renderSectionHeader={renderSectionHeader}
          numberColumns={numberOfColumns}
          itemSpacing={SPACE_BETWEEN_PHOTOS}
          sectionHeaderHeight={SECTION_HEADER_HEIGHT}
          onRefresh={onRefresh}
          refreshing={false}
        />
      </View>
    );
  },
);

PhotoGridComponent.displayName = 'PhotoGridComponent';

export default React.memo(PhotoGridComponent);

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
