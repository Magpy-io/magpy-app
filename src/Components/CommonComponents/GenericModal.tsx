import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

type GenericModalProps = {
  modalVisible: boolean;
  handleModal: () => void;
  children: JSX.Element;
};

export default function GenericModal({
  modalVisible,
  handleModal,
  children,
}: GenericModalProps) {
  const styles = useStyles(makeStyles);
  return (
    <Modal
      animationType="slide"
      transparent
      statusBarTranslucent
      visible={modalVisible}
      onRequestClose={handleModal}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.touchable} onPress={handleModal}></TouchableOpacity>
        <TouchableWithoutFeedback>
          <View style={styles.viewStyle}>{children}</View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    viewStyle: {
      backgroundColor: colors.BACKGROUND,
      width: '100%',
      position: 'absolute',
      bottom: 0,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      padding: 20,
      paddingTop: 30,
      elevation: 2,
    },
    touchable: {
      flex: 1,
    },
  });
