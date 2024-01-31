import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';

import PhotoGridController from './grid/PhotoGridController';
import PhotoSlider from './slider/PhotoSliderController';

type PhotoGalleryPropsType = {
  photos: Array<PhotoGalleryType>;
};

export default function PhotoGallery(props: PhotoGalleryPropsType) {
  const [switchingState, setSwitchingState] = useState({
    isSlidingPhotos: false,
    scrollPosition: 0,
  });

  const { isSlidingPhotos, scrollPosition } = switchingState;

  const onSwitchMode = useCallback((isSlidingPhotos: boolean, index: number) => {
    setSwitchingState({
      isSlidingPhotos: isSlidingPhotos,
      scrollPosition: index,
    });
  }, []);

  const displaySlider = isSlidingPhotos ? 'flex' : 'none';
  const displayGrid = isSlidingPhotos ? 'none' : 'flex';

  return (
    <View style={styles.viewStyle}>
      <View style={[styles.viewStyle, { display: displayGrid }]}>
        <PhotoGridController
          photos={props.photos}
          isSlidingPhotos={isSlidingPhotos}
          scrollPosition={scrollPosition}
          onSwitchMode={onSwitchMode}
        />
      </View>
      <View style={[styles.viewStyle, { display: displaySlider }]}>
        <PhotoSlider
          photos={props.photos}
          isSlidingPhotos={isSlidingPhotos}
          scrollPosition={scrollPosition}
          onSwitchMode={onSwitchMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
  },
});
