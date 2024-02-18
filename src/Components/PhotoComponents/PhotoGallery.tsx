import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import PhotoGridController from './grid/PhotoGridController';
import PhotoSliderController from './slider/PhotoSliderController';

type PhotoGalleryPropsType = {
  photos: Array<PhotoGalleryType>;
  title?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  isInTabScreen?: boolean;
};

export default function PhotoGallery(props: PhotoGalleryPropsType) {
  const styles = useStyles(makeStyles);

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
          photos={props.photos}
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
          photos={props.photos}
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
