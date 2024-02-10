import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

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
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleModal}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ flex: 1, opacity: 0.1, backgroundColor: 'black' }}
          onPress={handleModal}></TouchableOpacity>
        <TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: 'white',
              height: '80%',
              width: '100%',
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              padding: 20,
              paddingTop: 30,
            }}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
