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

  const displaySlider = switchingState.isPhotoSelected ? 'flex' : 'none';
  const displayGrid = switchingState.isPhotoSelected ? 'none' : 'flex';

  return (
    <View style={[styles.viewStyle, props.style]}>
      <View style={[styles.viewStyle, { display: displaySlider }]}>
        <PhotoSlider
          isSliding={switchingState.isPhotoSelected}
          startIndex={switchingState.startIndexWhenSwitching}
          onSwitchMode={onSwitchMode}
        />
      </View>
      <View style={[styles.viewStyle, { display: displayGrid }]}>
        <PhotoGridController startIndex={0} onSwitchMode={onSwitchMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
  },
});
