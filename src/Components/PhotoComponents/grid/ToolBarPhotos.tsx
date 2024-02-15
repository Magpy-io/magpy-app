import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  DeleteFromDeviceIcon,
  DeleteFromServerIcon,
  DeleteIcon,
  DownloadIcon,
  InfoIcon,
  ShareIcon,
  UploadIcon,
} from '~/Components/CommonComponents/Icons';
import { usePhotosDownloadingFunctions } from '~/Context/ContextSlices/PhotosDownloadingContext/usePhotosDownloadingContext';
import { PhotoGalleryType, PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/PhotosFunctions';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import ToolComponent from '../common/ToolComponent';
import PhotoDetailsModal from '../slider/PhotoDetailsModal';

type ToolBarProps = {
  selectedKeys: Set<string>;
};

function ToolBarPhotos(props: ToolBarProps) {
  const styles = useStyles(makeStyles);
  const [modalVisible, setModalVisible] = useState(false);
  const handleModal = () => setModalVisible(prev => !prev);
  const isOnePhoto = props.selectedKeys.size === 1;

  const localPhotos = useAppSelector(state => state.photos.photosLocal);
  const serverPhotos = useAppSelector(state => state.photos.photosServer);
  const galleryPhotos = useAppSelector(state => state.photos.photosGallery);

  const { UploadPhotos } = usePhotosFunctionsStore();

  const { DownloadPhotos } = usePhotosDownloadingFunctions();

  const seletedGalleryPhotos: PhotoGalleryType[] = [];

  for (const galleryPhoto of galleryPhotos) {
    if (props.selectedKeys.has(galleryPhoto.key)) {
      seletedGalleryPhotos.push(galleryPhoto);
    }
  }

  const selectedLocalPhotos: PhotoLocalType[] = [];

  for (const photo of seletedGalleryPhotos) {
    if (photo.serverId) {
      continue;
    }
    const localPhoto = photo.mediaId ? localPhotos[photo.mediaId] : undefined;
    if (localPhoto) {
      selectedLocalPhotos.push(localPhoto);
    }
  }

  const selectedServerPhotosIds: string[] = [];

  for (const photo of seletedGalleryPhotos) {
    if (photo.mediaId) {
      continue;
    }
    const serverPhoto = photo.serverId ? serverPhotos[photo.serverId] : undefined;
    if (serverPhoto) {
      selectedServerPhotosIds.push(serverPhoto.id);
    }
  }

  return (
    <View style={[styles.toolBarView]}>
      <ToolBarPhotosComponent
        onBackUp={() => {
          UploadPhotos(selectedLocalPhotos).catch(console.log);
        }}
        onDownload={() => DownloadPhotos(selectedServerPhotosIds)}
        onDelete={() => {}}
        onDeleteFromServer={() => {}}
        onDeleteFromDevice={() => {}}
        onShare={() => {}}
        showInfo={isOnePhoto}
        onInfo={handleModal}
      />
      {isOnePhoto && (
        <PhotoDetailsModal
          modalVisible={modalVisible}
          handleModal={handleModal}
          photo={galleryPhotos[0]}
        />
      )}
    </View>
  );
}

type ToolBarPhotosComponentProps = {
  onBackUp: () => void;
  onDownload: () => void;
  onDeleteFromDevice: () => void;
  onDelete: () => void;
  onDeleteFromServer: () => void;
  onShare: () => void;
  onInfo: () => void;
  showInfo: boolean;
};

function ToolBarPhotosComponent({
  onBackUp,
  onDelete,
  onDeleteFromDevice,
  onDownload,
  onInfo,
  onShare,
  showInfo,
  onDeleteFromServer,
}: ToolBarPhotosComponentProps) {
  const styles = useStyles(makeStyles);

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollviewContent}>
      <ToolComponent icon={UploadIcon} text="Back up" onPress={onBackUp} />

      <ToolComponent icon={DownloadIcon} text="Download" onPress={onDownload} />

      <ToolComponent
        icon={DeleteFromDeviceIcon}
        text="Delete from device"
        onPress={onDeleteFromDevice}
      />
      <ToolComponent icon={DeleteIcon} text="Delete everywhere" onPress={onDelete} />

      <ToolComponent
        icon={DeleteFromServerIcon}
        text="Delete from server"
        onPress={onDeleteFromServer}
      />

      <ToolComponent icon={ShareIcon} text="Share" onPress={onShare} />

      {showInfo && <ToolComponent icon={InfoIcon} text="Details" onPress={onInfo} />}
    </ScrollView>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    scrollviewContent: {},
    toolBarView: {
      width: '100%',
      position: 'absolute',
      backgroundColor: colors.BACKGROUND,
      bottom: 0,
    },
  });

export default React.memo(ToolBarPhotos);
