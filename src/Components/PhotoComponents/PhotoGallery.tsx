import React, { useCallback, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import PhotoGridController from './grid/PhotoGridController';
import PhotoSlider from './slider/PhotoSliderController';

type PhotoGalleryPropsType = {
  style?: StyleProp<ViewStyle>;
};

export default function PhotoGallery(props: PhotoGalleryPropsType) {
  const [switchingState, setSwitchingState] = useState({
    isPhotoSelected: false,
    startIndexWhenSwitching: 0,
  });

  const onSwitchMode = useCallback((isPhotoSelected: boolean, index: number) => {
    setSwitchingState(s => {
      if (s.isPhotoSelected != isPhotoSelected || s.startIndexWhenSwitching != index) {
        return {
          isPhotoSelected: isPhotoSelected,
          startIndexWhenSwitching: index,
        };
      } else {
        return s;
      }
    });
  }, []);

  return (
    <View style={[styles.viewStyle, props.style]}>
      {switchingState.isPhotoSelected ? (
        <View style={styles.viewStyle}>
          <PhotoSlider
            key={'photo_slider'}
            id={'photo_slider'}
            isSliding={switchingState.isPhotoSelected}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
          />
          <PhotoGridController
            key={'photo_grid'}
            id={'photo_grid'}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
          />
        </View>
      ) : (
        <View style={styles.viewStyle}>
          <PhotoGridController
            key={'photo_grid'}
            id={'photo_grid'}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
          />
          <PhotoSlider
            key={'photo_slider'}
            id={'photo_slider'}
            isSliding={switchingState.isPhotoSelected}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
  },
});
