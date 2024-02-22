import React, { useCallback, useEffect, useState } from 'react';
import {
  LayoutRectangle,
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import Animated, {
  AnimatedStyle,
  Easing,
  ReduceMotion,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '~/Context/ThemeContext';
import { useOrientation } from '~/Hooks/useOrientation';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

type GenericModalProps = {
  modalVisible: boolean;
  handleModal: () => void;
  children: JSX.Element;
  animation?: 'slide' | 'fade' | 'size';
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

const duration = 500;
const slideOptions = {
  duration: duration,
  easing: Easing.out(Easing.quad),
  reduceMotion: ReduceMotion.System,
};

const fadeOptions = {
  duration: duration,
};

const sizeOptions = {
  duration: duration,
  easing: Easing.inOut(Easing.quad),
  reduceMotion: ReduceMotion.System,
};

export default function GenericModal({
  modalVisible,
  handleModal,
  children,
  animation,
  style,
}: GenericModalProps) {
  const styles = useStyles(makeStyles);
  const { width, height } = useOrientation();
  const insets = useSafeAreaInsets();
  const [contentHeight, setContentHeight] = useState(height);
  const { dark } = useTheme();

  const progress = useSharedValue(0);
  const translateY = useSharedValue(contentHeight);
  const fade = useSharedValue(1);
  const size = useSharedValue(0);

  function getViewHeight(layout: LayoutRectangle) {
    const { height } = layout;
    setContentHeight(height);
  }

  const slidingViewStyle = { transform: [{ translateY: translateY }] };
  const fadingViewStyle = { opacity: fade };
  const increasingViewStyle = { maxWidth: size, maxHeight: size };

  const backDropAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['transparent', 'rgba(0,0,0,0.4)'],
      ),
    };
  });

  const changeBackdropOpacity = useCallback(() => {
    progress.value = withTiming(1 - progress.value, { duration: duration });
  }, [progress]);

  const slideIn = useCallback(() => {
    translateY.value = withTiming(0, slideOptions);
  }, [translateY]);

  const increase = useCallback(() => {
    size.value = withTiming(height, sizeOptions);
  }, [height, size]);

  const fadeIn = useCallback(() => {
    fade.value = withTiming(1, fadeOptions);
  }, [fade]);

  const slideOut = useCallback(() => {
    translateY.value = withTiming(contentHeight, slideOptions, () => {
      runOnJS(handleModal)();
    });
  }, [contentHeight, handleModal, translateY]);

  const fadeOut = useCallback(() => {
    fade.value = withTiming(0, fadeOptions, () => {
      runOnJS(handleModal)();
    });
  }, [fade, handleModal]);

  const decrease = useCallback(() => {
    size.value = withTiming(0, sizeOptions, () => {
      runOnJS(handleModal)();
    });
  }, [size, handleModal]);

  const hideModal = () => {
    changeBackdropOpacity();
    if (animation === 'size') {
      decrease();
    }
    if (animation === 'slide') {
      slideOut();
    }
    if (animation === 'fade') {
      fadeOut();
    }
  };

  useEffect(() => {
    if (modalVisible) {
      changeBackdropOpacity();
      if (animation === 'size') {
        increase();
      }
      if (animation === 'slide') {
        slideIn();
      }
      if (animation === 'fade') {
        fadeIn();
      }
    }
  }, [changeBackdropOpacity, modalVisible, slideIn, fadeIn, animation, increase]);

  return (
    <Modal visible={modalVisible} transparent statusBarTranslucent>
      <Animated.View
        style={[
          styles.modalStyle,
          {
            height: height + insets.top,
            width: width,
          },
          dark ? {} : backDropAnimatedStyle,
        ]}>
        <TouchableOpacity style={styles.touchable} onPress={hideModal}></TouchableOpacity>
        <Animated.View
          onLayout={event => getViewHeight(event.nativeEvent.layout)}
          style={[
            styles.viewStyle,
            animation === 'slide' ? slidingViewStyle : {},
            animation === 'fade' ? fadingViewStyle : {},
            animation === 'size' ? increasingViewStyle : {},
            style,
          ]}>
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    viewStyle: {
      backgroundColor: colors.MODAL_BACKGROUND,
      overflow: 'hidden',
    },
    touchable: {
      flex: 1,
    },
    modalStyle: {
      position: 'absolute',
      bottom: 0,
    },
  });
