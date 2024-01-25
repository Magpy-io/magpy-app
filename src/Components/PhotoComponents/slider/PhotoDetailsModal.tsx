import React from 'react';
import { Text, View } from 'react-native';

import { Icon } from 'react-native-elements';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { formatDate } from '~/Helpers/Date';
import { getReadableFileSizeString } from '~/Helpers/FileSizeFormat';

import GenericModal from '../../CommonComponents/GenericModal';

type PhotoDetailsModalProps = {
  modalVisible: boolean;
  handleModal: () => void;
  photo: PhotoGalleryType;
};

export default function PhotoDetailsModal({
  modalVisible,
  handleModal,
  photo,
}: PhotoDetailsModalProps) {
  return (
    <GenericModal modalVisible={modalVisible} handleModal={handleModal}>
      <>
        <PhotoInfo
          icon="image"
          title={photo.image.fileName}
          text={`${photo.image.width} x ${photo.image.height} px`}
        />
        <PhotoInfo
          icon="history"
          title={`Taken on ${formatDate(photo.created)}`}
          text={photo.modified ? `Modified on ${formatDate(photo.modified)}` : 'Unmodified'}
        />
        {photo.inServer && (
          <PhotoInfo
            icon="cloud-done"
            title={`Backed up (${getReadableFileSizeString(photo.image.fileSize)})`}
            text={`In server`}
          />
        )}
        {photo.inDevice && (
          <PhotoInfo
            icon="mobile-friendly"
            title={`On device (${getReadableFileSizeString(photo.image.fileSize)})`}
            text={`${photo?.image?.path?.split('://')?.[1]}`}
          />
        )}
      </>
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
    <View style={{ flexDirection: 'row', padding: 5, paddingBottom: 30 }}>
      <Icon name={icon} containerStyle={{ padding: 5, paddingRight: 30 }} />
      <View>
        <Text style={{ fontWeight: '600' }}>{title}</Text>
        <Text>{text}</Text>
      </View>
    </View>
  );
}
