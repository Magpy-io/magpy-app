import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
} from '~/Context/ReduxStore/Slices/Photos';

import PhotoGridController from './grid/PhotoGridController';
import PhotoSlider from './slider/PhotoSliderController';

type PhotoGalleryPropsType = {
  photos: Array<PhotoGalleryType>;
  localPhotos: {
    [key: string]: PhotoLocalType;
  };
  serverPhotos: {
    [key: string]: PhotoServerType;
  };
};

export default function PhotoGallery(props: PhotoGalleryPropsType) {
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

  return (
    <View style={styles.viewStyle}>
      <View style={[styles.viewStyle, { display: displayGrid }]}>
        <PhotoGridController
          photos={props.photos}
          localPhotos={props.localPhotos}
          serverPhotos={props.serverPhotos}
          isSlidingPhotos={isSlidingPhotos}
          currentPhotoIndex={currentPhotoIndex}
          onSwitchMode={onSwitchMode}
        />
      </View>
      <View style={[styles.viewStyle, { display: displaySlider }]}>
        <PhotoSlider
          photos={props.photos}
          isSlidingPhotos={isSlidingPhotos}
          currentPhotoIndex={currentPhotoIndex}
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
