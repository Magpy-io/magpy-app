import React, { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image';
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';

const H = Dimensions.get('screen').height;
const W = Dimensions.get('screen').width;

type PropsType = {
  photo: PhotoGalleryType;
  isFullScreen: boolean;
  onPress?: (item: PhotoGalleryType) => void;
  onLongPress?: (item: PhotoGalleryType) => void;
};

function PhotoComponentForSlider(props: PropsType) {
  console.log('render photo for slider');

  // const uriSource = useMemo(() => {
  //   if (props.photo.inDevice) {
  //     return props.photo.image.path;
  //   } else {
  //     if (props.photo.image.pathCache) {
  //       return props.photo.image.pathCache;
  //     } else {
  //       return props.photo.image.image64;
  //     }
  //   }
  // }, [props.photo]);

  const uriSource = props.photo.uri;

  const position = useSharedValue(0);
  const positionLast = useSharedValue(0);
  const positionY = useSharedValue(0);
  const positionYLast = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const [en, setEn] = useState(false);

  const panGesture = Gesture.Pan()
    .enabled(en)
    .onUpdate(e => {
      const newY = positionYLast.value + e.translationY / scale.value;
      positionY.value = newY;
      if (newY > (H * (scale.value - 1)) / 2 / scale.value) {
        positionY.value = (H * (scale.value - 1)) / 2 / scale.value;
      } else if (newY < (-H * (scale.value - 1)) / 2 / scale.value) {
        positionY.value = (-H * (scale.value - 1)) / 2 / scale.value;
      } else {
        positionY.value = newY;
      }

      const newX = positionLast.value + e.translationX / scale.value;
      if (newX > (W * (scale.value - 1)) / 2 / scale.value) {
        position.value = (W * (scale.value - 1)) / 2 / scale.value;
      } else if (newX < (-W * (scale.value - 1)) / 2 / scale.value) {
        position.value = (-W * (scale.value - 1)) / 2 / scale.value;
      } else {
        position.value = newX;
      }
    })
    .onEnd(() => {
      positionYLast.value = positionY.value;
      positionLast.value = position.value;
      console.log(positionLast.value, positionYLast.value);
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      if (savedScale.value * e.scale < 1) {
        scale.value = 1;
      } else if (savedScale.value * e.scale > 5) {
        scale.value = 5;
      } else {
        scale.value = savedScale.value * e.scale;
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      if (scale.value > 1) {
        runOnJS(setEn)(true);
      } else {
        runOnJS(setEn)(false);
      }
    });

  const composed = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: position.value },
      { translateY: positionY.value },
    ],
  }));

  return (
    <TouchableWithoutFeedback
      onPress={() => props.onPress?.(props.photo)}
      onLongPress={() => props.onLongPress?.(props.photo)}
      style={styles.touchableStyle}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.itemStyle, animatedStyle]}>
          <FastImage
            source={{ uri: uriSource }}
            resizeMode={FastImage.resizeMode.contain}
            style={[
              styles.imageStyle,
              props.isFullScreen ? { backgroundColor: 'black' } : { backgroundColor: 'white' },
            ]}
          />
        </Animated.View>
      </GestureDetector>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  touchableStyle: {},

  itemStyle: {
    width: W,
    height: H,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    backgroundColor: 'red',
  },
});

export default React.memo(PhotoComponentForSlider);
