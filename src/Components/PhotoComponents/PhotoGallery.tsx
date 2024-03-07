import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePhotoGalleryContext } from '~/Context/Contexts/PhotoGalleryContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import { filterPhotos } from './filters/functions';
import { PhotoGridComponentRefType } from './grid/PhotoGridComponent';
import PhotoGridController from './grid/PhotoGridController';
import { PhotoSliderComponentRefType } from './slider/PhotoSliderComponent';
import PhotoSliderController from './slider/PhotoSliderController';

type PhotoGalleryPropsType = {
  title?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  isInTabScreen?: boolean;
};

export default function PhotoGallery({ ...props }: PhotoGalleryPropsType) {
  const { filters: storeFilters, photos } = usePhotoGalleryContext();

  const styles = useStyles(makeStyles);
  const gridRef = useRef<PhotoGridComponentRefType>(null);
  const sliderRef = useRef<PhotoSliderComponentRefType>(null);

  const filteredPhotos = useMemo(() => {
    return filterPhotos(photos, storeFilters);
  }, [photos, storeFilters]);

  const [isSlidingPhotos, setIsSlidingPhotos] = useState(false);

  const onSwitchMode = useCallback((isSlidingPhotos: boolean, index: number) => {
    if (isSlidingPhotos) {
      sliderRef.current?.scrollToIndex({ index, animated: false });
    } else {
      gridRef.current?.scrollToIndex({ index, animated: true });
    }

    setIsSlidingPhotos(isSlidingPhotos);
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
          ref={gridRef}
          title={props.title}
          showBackButton={props.showBackButton}
          onPressBack={props.onPressBack}
          photos={filteredPhotos}
          isSlidingPhotos={isSlidingPhotos}
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
          ref={sliderRef}
          isSlidingPhotos={isSlidingPhotos}
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
