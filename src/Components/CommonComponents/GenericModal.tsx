import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import Animated, {
  AnimatedStyle,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOrientation } from '~/Hooks/useOrientation';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

type GenericModalProps = {
  modalVisible: boolean;
  handleModal: () => void;
  children: JSX.Element;
  animation?: 'slide' | 'fade';
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
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

  return (
    modalVisible && (
      <>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            styles.modalStyle,
            {
              height: height + insets.top,
              width: width,
            },
          ]}>
          <TouchableOpacity style={styles.touchable} onPress={handleModal}></TouchableOpacity>
          <Animated.View
            entering={
              animation === 'slide' ? SlideInDown : animation === 'fade' ? FadeIn : undefined
            }
            exiting={
              animation === 'slide' ? SlideOutDown : animation === 'fade' ? FadeOut : undefined
            }
            style={[styles.viewStyle, style]}>
            {children}
          </Animated.View>
        </Animated.View>
      </>
    )
  );
}

const makeStyles = (colors: colorsType, dark: boolean) =>
  StyleSheet.create({
    viewStyle: {
      backgroundColor: colors.MODAL_BACKGROUND,
    },
    touchable: {
      flex: 1,
    },
    modalStyle: {
      backgroundColor: dark ? 'transparent' : 'rgba(0,0,0,0.4)',
      position: 'absolute',
      bottom: 0,
    },
  });
