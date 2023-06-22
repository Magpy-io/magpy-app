import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-elements";
import { PhotoType } from "~/Helpers/types";
import GenericModal from "./CommonComponents/GenericModal";

type PhotoDetailsModalProps = {
  modalVisible: boolean;
  handleModal: () => void;
  photo: PhotoType;
};

export default function PhotoDetailsModal({
  modalVisible,
  handleModal,
  photo,
}: PhotoDetailsModalProps) {
  return (
    <GenericModal modalVisible={modalVisible} handleModal={handleModal}>
      <PhotoInfo
        icon="image"
        title={photo.image.fileName}
        text={`${photo.image.width} x ${photo.image.height}`}
      />
      <PhotoInfo
        icon="history"
        title={`Taken ${photo.created}`}
        text={`Modified ${photo.modified}`}
      />
      <PhotoInfo
        icon="cloud-done"
        title={`Backed up ${photo.image.fileSize}`}
        text={`In server`}
      />
      <PhotoInfo
        icon="mobile-friendly"
        title={`On device (${photo.image.fileSize})`}
        text={`${photo.image.path}`}
      />
    </GenericModal>
  );
}

type PhotoInfoProps = {
  icon: string;
  title: string;
  text?: string;
};
function PhotoInfo({ icon, title, text }: PhotoInfoProps) {
  return (
    <View style={{ flexDirection: "row", padding: 5, paddingBottom: 30 }}>
      <Icon name={icon} containerStyle={{ padding: 5, paddingRight: 30 }} />
      <View>
        <Text style={{ fontWeight: "600" }}>{title}</Text>
        <Text>{text}</Text>
      </View>
    </View>
  );
}
