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

export type AnimationType = 'slide' | 'fade' | 'scale' | 'none';

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
  const noAnimation = useNoAnimation();

  switch (animation) {
    case 'fade':
      return { animation: fadeAnimation, backdropAnimation };
    case 'scale':
      return { animation: scaleAnimation, backdropAnimation };
    case 'slide':
      return { animation: slideAnimation, backdropAnimation };
    case 'none':
      return { animation: noAnimation, backdropAnimation };
  }
}

function useBackdropAnimation() {
  const progress = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['transparent', 'rgba(0,0,0,0.4)'],
      ),
    };
  });
  const open = useCallback(
    (callback?: () => void) => {
      progress.value = withTiming(1, { duration: duration }, callbackToRunOnJS(callback));
    },
    [progress],
  );
  const close = useCallback(
    (callback?: () => void) => {
      progress.value = withTiming(0, { duration: duration }, callbackToRunOnJS(callback));
    },
    [progress],
  );

  return {
    open,
    close,
    style,
  };
}

function useNoAnimation() {
  const style = {};
  const open = (callback?: () => void) => {
    callback ? callback() : undefined;
  };
  const close = (callback?: () => void) => {
    callback ? callback() : undefined;
  };
  return {
    open,
    close,
    style,
  };
}

function useFadeAnimation() {
  const fade = useSharedValue(1);
  const style = { opacity: fade };

  const open = useCallback(
    (callback?: () => void) => {
      fade.value = withTiming(1, fadeOptions, callbackToRunOnJS(callback));
    },
    [fade],
  );

  const close = useCallback(
    (callback?: () => void) => {
      fade.value = withTiming(0, fadeOptions, callbackToRunOnJS(callback));
    },
    [fade],
  );

  return {
    open,
    close,
    style,
  };
}

function useSlideAnimation(contentHeight: number) {
  const translateY = useSharedValue(contentHeight);
  const style = { transform: [{ translateY: translateY }] };

  const open = useCallback(
    (callback?: () => void) => {
      translateY.value = withTiming(0, slideOptions, callbackToRunOnJS(callback));
    },
    [translateY],
  );

  const close = useCallback(
    (callback?: () => void) => {
      translateY.value = withTiming(contentHeight, slideOptions, callbackToRunOnJS(callback));
    },
    [contentHeight, translateY],
  );

  return {
    open,
    close,
    style,
  };
}

function useScaleAnimation() {
  const scale = useSharedValue(0);
  const style = { transform: [{ scale: scale }], transformOrigin: 'top right' };

  const open = useCallback(
    (callback?: () => void) => {
      scale.value = withTiming(1, sizeOptions, callbackToRunOnJS(callback));
    },
    [scale],
  );

  const close = useCallback(
    (callback?: () => void) => {
      scale.value = withTiming(0, sizeOptions, callbackToRunOnJS(callback));
    },
    [scale],
  );

  return {
    open,
    close,
    style,
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
