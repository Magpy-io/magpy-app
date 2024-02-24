import { useCallback } from 'react';

import {
  Easing,
  ReduceMotion,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type AnimationType = 'slide' | 'fade' | 'size';

const duration = 200;
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

export default function useModalAnimation({
  animation,
  contentHeight = 0,
}: {
  animation: AnimationType;
  contentHeight?: number;
}) {
  const backdropAnimation = useBackdropAnimation();
  const fadeAnimation = useFadeAnimation();
  const slideAnimation = useSlideAnimation(contentHeight);
  const scaleAnimation = useScaleAnimation();

  switch (animation) {
    case 'fade':
      return { animation: fadeAnimation, backdropAnimation };
    case 'size':
      return { animation: scaleAnimation, backdropAnimation };
    case 'slide':
      return { animation: slideAnimation, backdropAnimation };
    default:
      return { animation: fadeAnimation, backdropAnimation };
  }
}

function useBackdropAnimation() {
  const progress = useSharedValue(0);
  const backDropAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['transparent', 'rgba(0,0,0,0.4)'],
      ),
    };
  });
  const backdropAnimationOpen = useCallback(
    (callback?: () => void) => {
      progress.value = withTiming(1, { duration: duration }, callbackToRunOnJS(callback));
    },
    [progress],
  );
  const backdropAnimationClose = useCallback(
    (callback?: () => void) => {
      progress.value = withTiming(0, { duration: duration }, callbackToRunOnJS(callback));
    },
    [progress],
  );

  return {
    close: backdropAnimationClose,
    open: backdropAnimationOpen,
    style: backDropAnimatedStyle,
  };
}

function useFadeAnimation() {
  const fade = useSharedValue(1);
  const fadeViewStyle = { opacity: fade };

  const fadeAnimationOpen = useCallback(
    (callback?: () => void) => {
      fade.value = withTiming(1, fadeOptions, callbackToRunOnJS(callback));
    },
    [fade],
  );

  const fadeAnimationClose = useCallback(
    (callback?: () => void) => {
      fade.value = withTiming(0, fadeOptions, callbackToRunOnJS(callback));
    },
    [fade],
  );
  return {
    open: fadeAnimationOpen,
    close: fadeAnimationClose,
    style: fadeViewStyle,
  };
}

function useSlideAnimation(contentHeight: number) {
  const translateY = useSharedValue(contentHeight);
  const slideViewStyle = { transform: [{ translateY: translateY }] };

  const slideAnimationOpen = useCallback(
    (callback?: () => void) => {
      translateY.value = withTiming(0, slideOptions, callbackToRunOnJS(callback));
    },
    [translateY],
  );

  const slideAnimationClose = useCallback(
    (callback?: () => void) => {
      translateY.value = withTiming(contentHeight, slideOptions, callbackToRunOnJS(callback));
    },
    [contentHeight, translateY],
  );
  return {
    open: slideAnimationOpen,
    close: slideAnimationClose,
    style: slideViewStyle,
  };
}

function useScaleAnimation() {
  const scale = useSharedValue(0);

  const scaleViewStyle = { transform: [{ scale: scale }], transformOrigin: 'top right' };

  const scaleAnimationOpen = useCallback(
    (callback?: () => void) => {
      scale.value = withTiming(1, sizeOptions, callbackToRunOnJS(callback));
    },
    [scale],
  );

  const scaleAnimationClose = useCallback(
    (callback?: () => void) => {
      scale.value = withTiming(0, sizeOptions, callbackToRunOnJS(callback));
    },
    [scale],
  );

  return {
    open: scaleAnimationOpen,
    close: scaleAnimationClose,
    style: scaleViewStyle,
  };
}

function callbackToRunOnJS(callback?: () => void) {
  if (callback) {
    return () => {
      'worklet';
      runOnJS(callback)();
    };
  }
  return undefined;
}
