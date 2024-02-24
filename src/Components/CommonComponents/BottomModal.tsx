import React from 'react';
import { StyleSheet } from 'react-native';

import { useOrientation } from '~/Hooks/useOrientation';
import { spacing } from '~/Styles/spacing';

import GenericModal from './GenericModal/GenericModal';

const DEFAULT_MIN_HEIGHT = 0;
const DEFAULT_MAX_HEIGHT = 0.9;

type BottomModalProps = {
  modalVisible: boolean;
  onRequestClose: () => void;
  children: JSX.Element;
  maxHeight?: number;
  minHeight?: number;
};

export default function BottomModal({
  modalVisible,
  onRequestClose,
  children,
  maxHeight = DEFAULT_MAX_HEIGHT,
  minHeight = DEFAULT_MIN_HEIGHT,
}: BottomModalProps) {
  const { height } = useOrientation();
  return (
    <GenericModal
      modalVisible={modalVisible}
      onRequestClose={onRequestClose}
      animationType="slide"
      style={[
        styles.viewStyle,
        { maxHeight: height * maxHeight, minHeight: height * minHeight },
      ]}>
      {children}
    </GenericModal>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: spacing.spacing_xl,
  },
});
