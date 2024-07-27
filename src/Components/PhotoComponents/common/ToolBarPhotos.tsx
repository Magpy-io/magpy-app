import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { usePopupMessageModal } from '~/Components/CommonComponents/PopupMessageModal';
import { useMainContext, useMainContextFunctions } from '~/Context/Contexts/MainContext';
import { usePermissionsContext } from '~/Context/Contexts/PermissionsContext';
import { usePhotosDownloadingFunctions } from '~/Context/Contexts/PhotosDownloadingContext/usePhotosDownloadingContext';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
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

  const { askedForNotificationPermissionBefore } = useMainContext();
  const { setAskedForNotificationPermissionBefore } = useMainContextFunctions();

  const { notificationsPermissionStatus, askNotificationsPermission } =
    usePermissionsContext();

  const { displayPopupMessage } = usePopupMessageModal();

  const onRequestClose = useCallback(() => setModalVisible(false), []);
  const showModal = useCallback(() => setModalVisible(true), []);

  const isOnePhoto = selectedGalleryPhotos.length == 1;

  const localPhotos = useAppSelector(photosLocalSelector);

  const { UploadPhotos, DeletePhotosLocal, DeletePhotosServer, DeletePhotosEverywhere } =
    usePhotosFunctionsStore();
  const { StartPhotosDownload } = usePhotosDownloadingFunctions();

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

  const onBackup = useCallback(() => {
    if (notificationsPermissionStatus == 'PENDING' && !askedForNotificationPermissionBefore) {
      setAskedForNotificationPermissionBefore(true);

      const onDismissed = async () => {
        await askNotificationsPermission();
        await UploadPhotos(selectedLocalOnlyPhotos);
      };

      displayPopupMessage({
        title: 'Notification Permission Needed',
        content:
          'Allow Magpy to display notifications. This will be used to display the progress of the backing up of your photos.',
        onDismissed: () => {
          onDismissed().catch(console.log);
        },
      });
      return;
    }

    UploadPhotos(selectedLocalOnlyPhotos).catch(console.log);
  }, [
    UploadPhotos,
    askNotificationsPermission,
    askedForNotificationPermissionBefore,
    displayPopupMessage,
    notificationsPermissionStatus,
    selectedLocalOnlyPhotos,
    setAskedForNotificationPermissionBefore,
  ]);

  const onDownload = useCallback(
    () => StartPhotosDownload(selectedServerOnlyPhotosIds),
    [StartPhotosDownload, selectedServerOnlyPhotosIds],
  );

  const onDelete = useCallback(() => {
    DeletePhotosEverywhere(selectedGalleryPhotos)
      .then(() => clearSelection?.())
      .catch(console.log);
  }, [DeletePhotosEverywhere, clearSelection, selectedGalleryPhotos]);

  const onDeleteFromServer = useCallback(() => {
    DeletePhotosServer(selectedServerPhotosIds)
      .then(() => clearSelection?.())
      .catch(console.log);
  }, [DeletePhotosServer, clearSelection, selectedServerPhotosIds]);

  const onDeleteFromDevice = useCallback(() => {
    DeletePhotosLocal(selectedLocalPhotosIds)
      .then(() => clearSelection?.())
      .catch(console.log);
  }, [DeletePhotosLocal, clearSelection, selectedLocalPhotosIds]);

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
