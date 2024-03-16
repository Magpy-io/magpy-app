import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { usePhotosDownloadingFunctions } from '~/Context/Contexts/PhotosDownloadingContext/usePhotosDownloadingContext';
import { PhotoGalleryType, PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import { photosLocalSelector } from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import PhotoDetailsModal from '../slider/PhotoDetailsModal';
import ToolBarPhotosComponent from './ToolBarPhotosComponent';

type ToolBarProps = {
  selectedGalleryPhotos: PhotoGalleryType[];
  clearSelection?: () => void;
};

function ToolBarPhotos({ selectedGalleryPhotos, clearSelection }: ToolBarProps) {
  const styles = useStyles(makeStyles);
  const [modalVisible, setModalVisible] = useState(false);
  const onRequestClose = () => setModalVisible(false);
  const showModal = () => setModalVisible(true);
  const isOnePhoto = selectedGalleryPhotos.length == 1;

  const localPhotos = useAppSelector(photosLocalSelector);

  const { UploadPhotos, DeletePhotosLocal, DeletePhotosServer, DeletePhotosEverywhere } =
    usePhotosFunctionsStore();
  const { StartPhotosDownload } = usePhotosDownloadingFunctions();

  const selectedLocalOnlyPhotos: PhotoLocalType[] = [];
  const selectedServerOnlyPhotosIds: string[] = [];
  const selectedLocalPhotosIds: string[] = [];
  const selectedServerPhotosIds: string[] = [];

  for (const photo of selectedGalleryPhotos) {
    if (photo.serverId) {
      continue;
    }
    const localPhoto = photo.mediaId ? localPhotos[photo.mediaId] : undefined;
    if (localPhoto) {
      selectedLocalOnlyPhotos.push(localPhoto);
    }
  }

  for (const photo of selectedGalleryPhotos) {
    if (photo.mediaId) {
      continue;
    }

    if (!photo.serverId) {
      continue;
    }
    selectedServerOnlyPhotosIds.push(photo.serverId);
  }

  for (const photo of selectedGalleryPhotos) {
    if (!photo.mediaId) {
      continue;
    }
    selectedLocalPhotosIds.push(photo.mediaId);
  }

  for (const photo of selectedGalleryPhotos) {
    if (!photo.serverId) {
      continue;
    }
    selectedServerPhotosIds.push(photo.serverId);
  }

  const atleastOneLocal = selectedGalleryPhotos.find(p => p.mediaId);
  const atleastOneServer = selectedGalleryPhotos.find(p => p.serverId);

  const atleastOneServerAndOneLocal = atleastOneLocal && atleastOneServer;

  return (
    <View style={[styles.toolBarView]}>
      <ToolBarPhotosComponent
        nbPhotos={selectedGalleryPhotos.length}
        nbPhotosToBackUp={selectedLocalOnlyPhotos.length}
        nbPhotosToDownload={selectedServerOnlyPhotosIds.length}
        nbPhotosToDeleteEverywhere={
          atleastOneServerAndOneLocal ? selectedGalleryPhotos.length : 0
        }
        nbPhotosToDeleteFromServer={selectedServerPhotosIds.length}
        nbPhotosToDeleteFromDevice={selectedLocalPhotosIds.length}
        onBackUp={() => {
          UploadPhotos(selectedLocalOnlyPhotos).catch(console.log);
        }}
        onDownload={() => StartPhotosDownload(selectedServerOnlyPhotosIds)}
        onDelete={() => {
          DeletePhotosEverywhere(selectedGalleryPhotos)
            .then(() => clearSelection?.())
            .catch(console.log);
        }}
        onDeleteFromServer={() => {
          DeletePhotosServer(selectedServerPhotosIds)
            .then(() => clearSelection?.())
            .catch(console.log);
        }}
        onDeleteFromDevice={() => {
          DeletePhotosLocal(selectedLocalPhotosIds)
            .then(() => clearSelection?.())
            .catch(console.log);
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
