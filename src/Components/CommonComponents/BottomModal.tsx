import React from 'react';
import { StyleSheet } from 'react-native';

import GenericModal from './GenericModal';

type BottomModalProps = {
  modalVisible: boolean;
  onRequestClose: () => void;
  children: JSX.Element;
};

export default function BottomModal({
  modalVisible,
  onRequestClose,
  children,
}: BottomModalProps) {
  return (
    <GenericModal
      modalVisible={modalVisible}
      onRequestClose={onRequestClose}
      animationType="slide"
      style={styles.viewStyle}>
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
    padding: 20,
    paddingTop: 30,
  },
});
