import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { usePopupMessageModal } from '~/Components/CommonComponents/PopupMessageModal';
import { usePhotosDownloadingFunctions } from '~/Context/Contexts/PhotosDownloadingContext/usePhotosDownloadingContext';
import { useUploadWorkerContext } from '~/Context/Contexts/UploadWorkerContext';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import { photosLocalSelector } from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useStyles } from '~/Hooks/useStyles';
import { useToast } from '~/Hooks/useToast';
import { colorsType } from '~/Styles/colors';

import PhotoDetailsModal from '../slider/PhotoDetailsModal';
import { useUserActions } from './Actions/useUserActions';
import ToolBarPhotosComponent from './ToolBarPhotosComponent';

type ToolBarProps = {
  selectedGalleryPhotos: PhotoGalleryType[];
  clearSelection?: () => void;
};

function ToolBarPhotos({ selectedGalleryPhotos, clearSelection }: ToolBarProps) {
  const styles = useStyles(makeStyles);
  const [modalVisible, setModalVisible] = useState(false);

  const { showToastError } = useToast();

  const { displayPopupMessage } = usePopupMessageModal();

  const onRequestClose = useCallback(() => setModalVisible(false), []);
  const showModal = useCallback(() => setModalVisible(true), []);

  const isOnePhoto = selectedGalleryPhotos.length == 1;

  const localPhotos = useAppSelector(photosLocalSelector);

  const { DeletePhotosLocal, DeletePhotosServer, DeletePhotosEverywhere } =
    usePhotosFunctionsStore();
  const { StartPhotosDownload } = usePhotosDownloadingFunctions();

  const { IsMediaIdUploadQueued } = useUploadWorkerContext();
  const { IsDownloadQueued } = usePhotosDownloadingFunctions();

  const { UploadPhotosAction } = useUserActions();

  const selectedLocalOnlyPhotos = useMemo(() => {
    const selectedLocalOnlyPhotos = [];
    for (const photo of selectedGalleryPhotos) {
      if (photo.serverId) {
        continue;
      }
      const localPhoto = photo.mediaId ? localPhotos[photo.mediaId] : undefined;
      if (localPhoto) {
        selectedLocalOnlyPhotos.push(localPhoto);
      }
    }
    return selectedLocalOnlyPhotos;
  }, [localPhotos, selectedGalleryPhotos]);

  const selectedServerOnlyPhotosIds = useMemo(() => {
    const selectedServerOnlyPhotosIds = [];
    for (const photo of selectedGalleryPhotos) {
      if (photo.mediaId) {
        continue;
      }

      if (!photo.serverId) {
        continue;
      }
      selectedServerOnlyPhotosIds.push(photo.serverId);
    }
    return selectedServerOnlyPhotosIds;
  }, [selectedGalleryPhotos]);

  const selectedLocalPhotosIds = useMemo(() => {
    const selectedLocalPhotosIds = [];

    for (const photo of selectedGalleryPhotos) {
      if (!photo.mediaId) {
        continue;
      }
      selectedLocalPhotosIds.push(photo.mediaId);
    }

    return selectedLocalPhotosIds;
  }, [selectedGalleryPhotos]);

  const selectedServerPhotosIds = useMemo(() => {
    const selectedServerPhotosIds = [];

    for (const photo of selectedGalleryPhotos) {
      if (!photo.serverId) {
        continue;
      }
      selectedServerPhotosIds.push(photo.serverId);
    }
    return selectedServerPhotosIds;
  }, [selectedGalleryPhotos]);

  const atleastOneLocal = selectedGalleryPhotos.find(p => p.mediaId);
  const atleastOneServer = selectedGalleryPhotos.find(p => p.serverId);

  const atleastOneServerAndOneLocal = atleastOneLocal && atleastOneServer;

  const isPhotoBeingUploaded = useMemo(() => {
    if (isOnePhoto && atleastOneLocal) {
      const selectedPhoto = selectedGalleryPhotos[0];
      return IsMediaIdUploadQueued(selectedPhoto.mediaId ?? '');
    }
    return false;
  }, [atleastOneLocal, IsMediaIdUploadQueued, isOnePhoto, selectedGalleryPhotos]);

  const isPhotoBeingDownloaded = useMemo(() => {
    if (isOnePhoto && atleastOneServer) {
      const selectedPhoto = selectedGalleryPhotos[0];
      return IsDownloadQueued(selectedPhoto.serverId ?? '');
    }
    return false;
  }, [atleastOneServer, IsDownloadQueued, isOnePhoto, selectedGalleryPhotos]);

  const onBackup = useCallback(() => {
    UploadPhotosAction(selectedLocalOnlyPhotos);
  }, [UploadPhotosAction, selectedLocalOnlyPhotos]);

  const onDownload = useCallback(() => {
    try {
      StartPhotosDownload(selectedServerOnlyPhotosIds);
    } catch (err) {
      showToastError('Failed to start photo download.');
      console.log(err);
    }
  }, [StartPhotosDownload, selectedServerOnlyPhotosIds, showToastError]);

  const onDelete = useCallback(() => {
    const photosToDeleteCount = selectedGalleryPhotos.length;

    const photosMessage =
      photosToDeleteCount == 1 ? 'this photo' : photosToDeleteCount.toString() + ' photos';

    displayPopupMessage({
      title: 'Deletion confirmation',
      ok: 'Yes',
      cancel: 'Cancel',
      content: 'Are you sure you want to delete ' + photosMessage + ' permanently ?',
      onDismissed: userAction => {
        if (userAction == 'Ok') {
          DeletePhotosEverywhere(selectedGalleryPhotos)
            .then(() => clearSelection?.())
            .catch(err => {
              if ((err as { code: string })?.code != 'ERROR_USER_REJECTED') {
                showToastError('Failed to delete photos.');
              }
              console.log(err);
            });
        }
      },
    });
  }, [
    DeletePhotosEverywhere,
    clearSelection,
    displayPopupMessage,
    selectedGalleryPhotos,
    showToastError,
  ]);

  const onDeleteFromServer = useCallback(() => {
    const photosToDeleteCount = selectedServerPhotosIds.length;

    const photosMessage =
      photosToDeleteCount == 1 ? 'this photo' : photosToDeleteCount.toString() + ' photos';

    displayPopupMessage({
      title: 'Deletion confirmation',
      ok: 'Yes',
      cancel: 'Cancel',
      content: 'Are you sure you want to delete ' + photosMessage + ' from server ?',
      onDismissed: userAction => {
        if (userAction == 'Ok') {
          DeletePhotosServer(selectedServerPhotosIds)
            .then(() => clearSelection?.())
            .catch(err => {
              showToastError('Failed to delete photos.');
              console.log(err);
            });
        }
      },
    });
  }, [
    DeletePhotosServer,
    clearSelection,
    displayPopupMessage,
    selectedServerPhotosIds,
    showToastError,
  ]);

  const onDeleteFromDevice = useCallback(() => {
    DeletePhotosLocal(selectedLocalPhotosIds)
      .then(() => clearSelection?.())
      .catch(err => {
        if ((err as { code: string })?.code != 'ERROR_USER_REJECTED') {
          showToastError('Failed to delete photos.');
        }
        console.log(err);
      });
  }, [DeletePhotosLocal, clearSelection, selectedLocalPhotosIds, showToastError]);

  const onShare = useCallback(() => {}, []);

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
        onBackUp={onBackup}
        onDownload={onDownload}
        onDelete={onDelete}
        onDeleteFromServer={onDeleteFromServer}
        onDeleteFromDevice={onDeleteFromDevice}
        onShare={onShare}
        showInfo={isOnePhoto}
        onInfo={showModal}
        isPhotoBeingUploaded={isPhotoBeingUploaded}
        isPhotoBeingDownloaded={isPhotoBeingDownloaded}
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
