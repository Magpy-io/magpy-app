import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { usePhotosDownloadingFunctions } from '~/Context/ContextSlices/PhotosDownloadingContext/usePhotosDownloadingContext';
import { PhotoGalleryType, PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import {
  photosGallerySelector,
  photosLocalSelector,
  photosServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import PhotoDetailsModal from '../slider/PhotoDetailsModal';
import ToolBarPhotosComponent from './ToolBarPhotosComponent';

type ToolBarProps = {
  selectedKeys: Set<string>;
};

function ToolBarPhotos(props: ToolBarProps) {
  const styles = useStyles(makeStyles);
  const [modalVisible, setModalVisible] = useState(false);
  const handleModal = () => setModalVisible(prev => !prev);
  const isOnePhoto = props.selectedKeys.size === 1;

  const localPhotos = useAppSelector(photosLocalSelector);
  const serverPhotos = useAppSelector(photosServerSelector);
  const galleryPhotos = useAppSelector(photosGallerySelector);

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
