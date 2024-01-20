import React, { useCallback, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { PhotoType } from '~/Helpers/types';

import PhotoGridController from './PhotoComponents/grid/PhotoGridController';
import PhotoSlider from './PhotoComponents/slider/PhotoSlider';

type PhotoGalleryPropsType = {
  style?: StyleProp<ViewStyle>;
  photos: PhotoType[];
  contextLocation: string;
  gridHeaderTextFunction?: (photosNb: number) => string;
};

export default function PhotoGallery(props: PhotoGalleryPropsType) {
  console.log('render gallery', props.contextLocation);

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
            key={'photo_slider_' + props.contextLocation}
            id={'photo_slider_' + props.contextLocation}
            contextLocation={props.contextLocation}
            isSliding={switchingState.isPhotoSelected}
            style={{}}
            photos={props.photos}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
          />
          <PhotoGridController
            key={'photo_grid_' + props.contextLocation}
            id={'photo_grid_' + props.contextLocation}
            contextLocation={props.contextLocation}
            style={{}}
            photos={props.photos}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
            headerDisplayTextFunction={props.gridHeaderTextFunction}
          />
        </View>
      ) : (
        <View style={styles.viewStyle}>
          <PhotoGridController
            key={'photo_grid_' + props.contextLocation}
            id={'photo_grid_' + props.contextLocation}
            contextLocation={props.contextLocation}
            style={{}}
            photos={props.photos}
            startIndex={switchingState.startIndexWhenSwitching}
            onSwitchMode={onSwitchMode}
            headerDisplayTextFunction={props.gridHeaderTextFunction}
          />
          <PhotoSlider
            key={'photo_slider_' + props.contextLocation}
            id={'photo_slider_' + props.contextLocation}
            contextLocation={props.contextLocation}
            isSliding={switchingState.isPhotoSelected}
            style={{}}
            photos={props.photos}
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
