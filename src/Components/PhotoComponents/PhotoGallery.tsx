import React, { useCallback, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import PhotoGridController from './grid/PhotoGridController';
import PhotoSlider from './slider/PhotoSliderController';

type PhotoGalleryPropsType = {
  style?: StyleProp<ViewStyle>;
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
    <View style={[styles.viewStyle, props.style]}>
      <View style={[styles.viewStyle, { display: displayGrid }]}>
        <PhotoGridController
          isSlidingPhotos={isSlidingPhotos}
          scrollPosition={scrollPosition}
          onSwitchMode={onSwitchMode}
        />
      </View>
      <View style={[styles.viewStyle, { display: displaySlider }]}>
        <PhotoSlider
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
