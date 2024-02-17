import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image';
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import {
  photoLocalSelector,
  photoServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useTheme } from '~/Context/ThemeContext';

const H = Dimensions.get('screen').height;
const W = Dimensions.get('screen').width;

type PropsType = {
  photo: PhotoGalleryType;
  isFullScreen: boolean;
  onPress?: (item: PhotoGalleryType) => void;
  onLongPress?: (item: PhotoGalleryType) => void;
};

function PhotoComponentForSlider(props: PropsType) {
  //console.log('render photo for slider');

  const { colors } = useTheme();
  const localPhoto = useAppSelector(photoLocalSelector(props.photo.mediaId));
  const serverPhoto = useAppSelector(photoServerSelector(props.photo.serverId));

  const { AddPhotoCompressedIfMissing } = usePhotosFunctionsStore();

  useEffect(() => {
    if (serverPhoto && !localPhoto && !serverPhoto.uriCompressed) {
      AddPhotoCompressedIfMissing(serverPhoto).catch(console.log);
    }
  }, [AddPhotoCompressedIfMissing, localPhoto, serverPhoto]);

  let uriSource = '';

  if (localPhoto) {
    uriSource = localPhoto.uri;
  } else if (serverPhoto?.uriCompressed) {
    uriSource = serverPhoto.uriCompressed;
  } else if (serverPhoto?.uriThumbnail) {
    uriSource = serverPhoto.uriThumbnail;
  }

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
              props.isFullScreen
                ? { backgroundColor: 'black' }
                : { backgroundColor: colors.BACKGROUND },
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
  },
});

export default React.memo(PhotoComponentForSlider);
