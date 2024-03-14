import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeModules } from 'react-native';

import { usePhotosDownloadingFunctions } from '~/Context/Contexts/PhotosDownloadingContext/usePhotosDownloadingContext';
import { PhotoGalleryType, PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import {
  photosLocalSelector,
  photosServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import PhotoDetailsModal from '../slider/PhotoDetailsModal';
import ToolBarPhotosComponent from './ToolBarPhotosComponent';

const { MainModule } = NativeModules;

type ToolBarProps = {
  selectedGalleryPhotos: PhotoGalleryType[];
};

function getPhotosStatus(selectedGalleryPhotos: PhotoGalleryType[]) {
  const nbLocalPhotos = selectedGalleryPhotos.filter(photo => photo.mediaId).length;
  const nbServerPhotos = selectedGalleryPhotos.filter(photo => photo.serverId).length;

  const nbLocalOnlyPhotos = selectedGalleryPhotos.filter(
    photo => photo.mediaId && !photo.serverId,
  ).length;
  const nbServerOnlyPhotos = selectedGalleryPhotos.filter(
    photo => photo.serverId && !photo.mediaId,
  ).length;
  const nbLocalAndServerPhotos = selectedGalleryPhotos.filter(
    photo => photo.mediaId && photo.serverId,
  ).length;

  return {
    nbLocalPhotos,
    nbServerPhotos,
    nbLocalAndServerPhotos,
    nbLocalOnlyPhotos,
    nbServerOnlyPhotos,
  };
}

function ToolBarPhotos({ selectedGalleryPhotos }: ToolBarProps) {
  const styles = useStyles(makeStyles);
  const [modalVisible, setModalVisible] = useState(false);
  const onRequestClose = () => setModalVisible(false);
  const showModal = () => setModalVisible(true);
  const isOnePhoto = selectedGalleryPhotos.length == 1;

  const localPhotos = useAppSelector(photosLocalSelector);
  const serverPhotos = useAppSelector(photosServerSelector);

  const { UploadPhotos } = usePhotosFunctionsStore();
  const { DownloadPhotos } = usePhotosDownloadingFunctions();

  const selectedLocalPhotos: PhotoLocalType[] = [];

  for (const photo of selectedGalleryPhotos) {
    if (photo.serverId) {
      continue;
    }
    const localPhoto = photo.mediaId ? localPhotos[photo.mediaId] : undefined;
    if (localPhoto) {
      selectedLocalPhotos.push(localPhoto);
    }
  }

  const selectedServerPhotosIds: string[] = [];

  for (const photo of selectedGalleryPhotos) {
    if (photo.mediaId) {
      continue;
    }
    const serverPhoto = photo.serverId ? serverPhotos[photo.serverId] : undefined;
    if (serverPhoto) {
      selectedServerPhotosIds.push(serverPhoto.id);
    }
  }

  const localPhoto = localPhotos[selectedGalleryPhotos?.[0]?.mediaId ?? ''];

  const {
    nbLocalPhotos,
    nbServerPhotos,
    nbLocalAndServerPhotos,
    nbLocalOnlyPhotos,
    nbServerOnlyPhotos,
  } = getPhotosStatus(selectedGalleryPhotos);

  return (
    <View style={[styles.toolBarView]}>
      <ToolBarPhotosComponent
        nbPhotos={selectedGalleryPhotos.length}
        nbPhotosToBackUp={nbLocalOnlyPhotos}
        nbPhotosToDownload={nbServerOnlyPhotos}
        nbPhotosToDeleteEverywhere={nbLocalAndServerPhotos}
        nbPhotosToDeleteFromServer={nbServerPhotos}
        nbPhotosToDeleteFromDevice={nbLocalPhotos}
        onBackUp={() => {
          UploadPhotos(selectedLocalPhotos).catch(console.log);
        }}
        onDownload={() => DownloadPhotos(selectedServerPhotosIds)}
        onDelete={() => {}}
        onDeleteFromServer={() => {}}
        onDeleteFromDevice={() => {
          MainModule.deleteMedia([localPhoto.uri]).catch(console.log);
        }}
        onShare={() => {}}
        showInfo={isOnePhoto}
        onInfo={showModal}
      />
      {isOnePhoto && (
        <PhotoDetailsModal
          modalVisible={modalVisible}
          onRequestClose={onRequestClose}
          photo={selectedGalleryPhotos[0]}
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
      elevation: 8,
    },
  });

export default React.memo(ToolBarPhotos);
