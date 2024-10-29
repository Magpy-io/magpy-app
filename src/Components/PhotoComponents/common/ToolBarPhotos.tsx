import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useLoadingScreen } from '~/Components/CommonComponents/LoadingScreen/LoadingScreenContext';
import { usePopupMessageModal } from '~/Components/CommonComponents/PopupMessageModal';
import { usePhotosDownloadingFunctions } from '~/Context/Contexts/PhotosDownloadingContext/usePhotosDownloadingContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useUploadWorkerContext } from '~/Context/Contexts/UploadWorkerContext';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import { LOG } from '~/Helpers/Logging/Logger';
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
  const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();

  const onRequestClose = useCallback(() => setModalVisible(false), []);
  const showModal = useCallback(() => setModalVisible(true), []);

  const isOnePhoto = selectedGalleryPhotos.length == 1;

  const { DeletePhotosLocal, DeletePhotosServer } = usePhotosFunctionsStore();
  const { StartPhotosDownload } = usePhotosDownloadingFunctions();

  const { IsMediaIdUploadQueued } = useUploadWorkerContext();
  const { IsDownloadQueued } = usePhotosDownloadingFunctions();

  const { UploadPhotosAction } = useUserActions();

  const { isServerReachable } = useServerContext();

  const selectedLocalOnlyPhotos = useMemo(() => {
    return selectedGalleryPhotos
      .filter(photo => photo.mediaId && !photo.serverId)
      .map(photo => photo.mediaId);
  }, [selectedGalleryPhotos]) as string[];

  const selectedServerOnlyPhotosIds = useMemo(() => {
    return selectedGalleryPhotos
      .filter(photo => photo.serverId && !photo.mediaId)
      .map(photo => photo.serverId);
  }, [selectedGalleryPhotos]) as string[];

  const selectedLocalPhotosIds = useMemo(() => {
    return selectedGalleryPhotos.filter(photo => photo.mediaId).map(photo => photo.mediaId);
  }, [selectedGalleryPhotos]) as string[];

  const selectedServerPhotosIds = useMemo(() => {
    return selectedGalleryPhotos.filter(photo => photo.serverId).map(photo => photo.serverId);
  }, [selectedGalleryPhotos]) as string[];

  const atleastOneLocal = selectedLocalPhotosIds.length > 0;
  const atleastOneServer = selectedServerPhotosIds.length > 0;

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

  const CheckServerReachable = useCallback(() => {
    if (!isServerReachable) {
      showToastError('Server not connected.');
      return false;
    }
    return true;
  }, [isServerReachable, showToastError]);

  const onBackup = useCallback(() => {
    try {
      if (!CheckServerReachable()) {
        return;
      }
      UploadPhotosAction(selectedLocalOnlyPhotos);
    } catch (err) {
      showToastError('Failed to start photo upload.');
      LOG.error(err);
    }
  }, [CheckServerReachable, UploadPhotosAction, selectedLocalOnlyPhotos, showToastError]);

  const onDownload = useCallback(() => {
    try {
      if (!CheckServerReachable()) {
        return;
      }
      StartPhotosDownload(selectedServerOnlyPhotosIds);
    } catch (err) {
      showToastError('Failed to start photo download.');
      LOG.error(err);
    }
  }, [CheckServerReachable, StartPhotosDownload, selectedServerOnlyPhotosIds, showToastError]);

  const onDeleteEverywhere = useCallback(() => {
    if (!CheckServerReachable()) {
      return;
    }

    const photosToDeleteCount = selectedGalleryPhotos.length;

    const photosMessage =
      photosToDeleteCount == 1 ? 'this photo' : photosToDeleteCount.toString() + ' photos';

    displayPopupMessage({
      title: 'Deletion confirmation',
      ok: 'Yes',
      cancel: 'Cancel',
      content: 'Are you sure you want to delete ' + photosMessage + ' from server ?',
      onDismissed: userAction => {
        if (userAction == 'Ok') {
          showLoadingScreen();
          DeletePhotosServer(selectedServerPhotosIds)
            .then(() => {
              return DeletePhotosLocal(selectedLocalPhotosIds);
            })
            .then(() => clearSelection?.())
            .catch(err => {
              if ((err as { code: string })?.code != 'ERROR_USER_REJECTED') {
                showToastError('Failed to delete photos.');
              }
              LOG.error(err);
            })
            .finally(() => {
              hideLoadingScreen();
            });
        }
      },
    });
  }, [
    CheckServerReachable,
    DeletePhotosServer,
    DeletePhotosLocal,
    clearSelection,
    displayPopupMessage,
    hideLoadingScreen,
    selectedGalleryPhotos.length,
    selectedServerPhotosIds,
    selectedLocalPhotosIds,
    showLoadingScreen,
    showToastError,
  ]);

  const onDeleteFromServer = useCallback(() => {
    if (!CheckServerReachable()) {
      return;
    }
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
          showLoadingScreen();
          DeletePhotosServer(selectedServerPhotosIds)
            .then(() => clearSelection?.())
            .catch(err => {
              showToastError('Failed to delete photos.');
              LOG.error(err);
            })
            .finally(() => {
              hideLoadingScreen();
            });
        }
      },
    });
  }, [
    CheckServerReachable,
    DeletePhotosServer,
    clearSelection,
    displayPopupMessage,
    selectedServerPhotosIds,
    showToastError,
    showLoadingScreen,
    hideLoadingScreen,
  ]);

  const onDeleteFromDevice = useCallback(() => {
    DeletePhotosLocal(selectedLocalPhotosIds)
      .then(() => clearSelection?.())
      .catch(err => {
        if ((err as { code: string })?.code != 'ERROR_USER_REJECTED') {
          showToastError('Failed to delete photos.');
        }
        LOG.error(err);
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
        onDelete={onDeleteEverywhere}
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
