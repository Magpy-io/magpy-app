import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '~/Context/ThemeContext';
import { useOrientation } from '~/Hooks/useOrientation';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import useModalAnimation, { AnimationType } from './useModalAnimation';

type GenericModalProps = {
  modalVisible: boolean;
  onRequestClose: () => void;
  children: JSX.Element;
  animationType: AnimationType;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

export default function GenericModal({
  modalVisible,
  onRequestClose,
  children,
  animationType,
  style,
}: GenericModalProps) {
  const styles = useStyles(makeStyles);
  const { dark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useOrientation();

  const [contentHeight, setContentHeight] = useState(height);
  const [visible, setVisible] = useState(modalVisible);
  const modalVisibleLastValue = useRef(false);
  const visibleLastValue = useRef(false);

  const { animation, backdropAnimation } = useModalAnimation({
    animation: animationType,
    contentHeight,
  });

  const callback = () => {
    setVisible(false);
  };

  const hideModal = useCallback(() => {
    backdropAnimation.close();
    animation.close(callback);
  }, [animation, backdropAnimation]);

  useEffect(() => {
    if (modalVisible === modalVisibleLastValue.current) {
      return;
    }
    modalVisibleLastValue.current = modalVisible;

    if (modalVisible) {
      setVisible(true);
    } else {
      hideModal();
    }
  }, [animation, backdropAnimation, hideModal, modalVisible]);

  useEffect(() => {
    if (visibleLastValue.current != visible) {
      visibleLastValue.current = visible;
      if (visible) {
        backdropAnimation.open();
        animation.open();
      }
    }
  }, [animation, backdropAnimation, visible]);

  return (
    <Modal visible={visible} transparent statusBarTranslucent onRequestClose={onRequestClose}>
      <Animated.View
        style={[
          styles.modalStyle,
          {
            height: height + insets.top,
            width: width,
          },
          dark ? {} : backdropAnimation.style,
        ]}>
        <TouchableOpacity style={styles.touchable} onPress={onRequestClose}></TouchableOpacity>
        <Animated.View
          onLayout={event => setContentHeight(event.nativeEvent.layout.height)}
          style={[styles.viewStyle, animation.style, style]}>
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
