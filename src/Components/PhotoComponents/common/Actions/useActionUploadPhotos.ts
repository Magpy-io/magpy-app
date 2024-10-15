import { useCallback } from 'react';

import { usePopupMessageModal } from '~/Components/CommonComponents/PopupMessageModal';
import { useMainContext, useMainContextFunctions } from '~/Context/Contexts/MainContext';
import { usePermissionsContext } from '~/Context/Contexts/PermissionsContext';
import { PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import { useToast } from '~/Hooks/useToast';

const MAX_NUMBER_PHOTOS_TO_UPLOAD = 500;

export function useActionUploadPhotos() {
  const { notificationsPermissionStatus, askNotificationsPermission } =
    usePermissionsContext();

  const { neverAskForNotificationPermissionAgain } = useMainContext();
  const { setNeverAskForNotificationPermissionAgain } = useMainContextFunctions();

  const { showToastError } = useToast();

  const { displayPopupMessage } = usePopupMessageModal();

  const { UploadPhotos } = usePhotosFunctionsStore();

  const UploadPhotosAction = useCallback(
    (photosToUpload: PhotoLocalType[]) => {
      const photosToUploadMaxed = photosToUpload.slice(0, MAX_NUMBER_PHOTOS_TO_UPLOAD);

      if (
        notificationsPermissionStatus == 'PENDING' &&
        !neverAskForNotificationPermissionAgain
      ) {
        displayPopupMessage({
          title: 'Notification Permission Needed',
          cancel: 'Never ask again',
          content:
            'Allow Magpy to display notifications. This will be used to display the progress of the backing up of your photos.',
          onDismissed: userAction => {
            if (userAction == 'Cancel') {
              setNeverAskForNotificationPermissionAgain(true);
            }

            const AskNotificationPermissionPromise = new Promise((res, rej) => {
              if (userAction == 'Ok') {
                askNotificationsPermission().then(res).catch(rej);
              } else {
                res(null);
              }
            });

            AskNotificationPermissionPromise.then(() => {
              UploadPhotos(photosToUploadMaxed);
            }).catch(err => {
              showToastError('Failed to start photo upload.');
              console.log(err);
            });
          },
        });
        return;
      }

      UploadPhotos(photosToUploadMaxed);
    },
    [
      UploadPhotos,
      askNotificationsPermission,
      neverAskForNotificationPermissionAgain,
      displayPopupMessage,
      notificationsPermissionStatus,
      setNeverAskForNotificationPermissionAgain,
      showToastError,
    ],
  );

  return { UploadPhotosAction };
}
