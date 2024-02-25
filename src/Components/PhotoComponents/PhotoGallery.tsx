import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FiltersSelector } from '~/Context/ReduxStore/Slices/GalleryFilters/Selectors';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import { DateFilter } from './filters/DateFilter';
import { StatusFilter } from './filters/StatusFilter';
import { TypeFilter } from './filters/TypeFilter';
import PhotoGridController from './grid/PhotoGridController';
import PhotoSliderController from './slider/PhotoSliderController';

type PhotoGalleryPropsType = {
  photos: Array<PhotoGalleryType>;
  title?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  isInTabScreen?: boolean;
};

export default function PhotoGallery({ photos, ...props }: PhotoGalleryPropsType) {
  const styles = useStyles(makeStyles);
  const { filters: storeFilters } = useAppSelector(FiltersSelector);

  console.log('storeFilters', storeFilters);

  const filteredPhotos = useMemo(() => {
    let newPhotos = [...photos];
    storeFilters.forEach(f => {
      if (f.type === 'Type') {
        const filter = new TypeFilter(f.params.value);
        newPhotos = filter.filter(photos);
      } else if (f.type === 'Status') {
        const filter = new StatusFilter(f.params.value);
        newPhotos = filter.filter(newPhotos);
      } else if (f.type === 'Date') {
        const filter = new DateFilter(f.params.fromDate, f.params.toDate, f.params.label);
        newPhotos = filter.filter(newPhotos);
      }
    });
    return newPhotos;
  }, [photos, storeFilters]);

  const [switchingState, setSwitchingState] = useState({
    isSlidingPhotos: false,
    currentPhotoIndex: 0,
  });

  const { isSlidingPhotos, currentPhotoIndex } = switchingState;

  const onSwitchMode = useCallback((isSlidingPhotos: boolean, index: number) => {
    setSwitchingState({
      isSlidingPhotos: isSlidingPhotos,
      currentPhotoIndex: index,
    });
  }, []);

  const displaySlider = isSlidingPhotos ? 'flex' : 'none';
  const displayGrid = isSlidingPhotos ? 'none' : 'flex';
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.viewStyle}>
      <View
        style={[
          styles.viewStyle,
          { display: displayGrid },
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}>
        <PhotoGridController
          title={props.title}
          showBackButton={props.showBackButton}
          onPressBack={props.onPressBack}
          photos={filteredPhotos}
          isSlidingPhotos={isSlidingPhotos}
          currentPhotoIndex={currentPhotoIndex}
          onSwitchMode={onSwitchMode}
          isInTabScreen={props.isInTabScreen}
        />
      </View>
      <View
        style={[
          styles.viewStyle,
          { display: displaySlider },
          { paddingBottom: insets.bottom },
        ]}>
        <PhotoSliderController
          photos={filteredPhotos}
          isSlidingPhotos={isSlidingPhotos}
          currentPhotoIndex={currentPhotoIndex}
          onSwitchMode={onSwitchMode}
        />
      </View>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    viewStyle: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
  });
