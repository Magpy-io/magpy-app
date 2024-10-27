import { useCallback } from 'react';

import { usePopupMessageModal } from '~/Components/CommonComponents/PopupMessageModal';
import { useMainContext, useMainContextFunctions } from '~/Context/Contexts/MainContext';
import { usePermissionsContext } from '~/Context/Contexts/PermissionsContext';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import { useToast } from '~/Hooks/useToast';

export function useUserActions() {
  const { notificationsPermissionStatus, askNotificationsPermission } =
    usePermissionsContext();

  const { neverAskForNotificationPermissionAgain } = useMainContext();
  const { setNeverAskForNotificationPermissionAgain } = useMainContextFunctions();

  const { showToastError } = useToast();

  const { displayPopupMessage } = usePopupMessageModal();

  const { UploadPhotos } = usePhotosFunctionsStore();

  const UploadPhotosAction = useCallback(
    (mediaIds: string[]) => {
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
              UploadPhotos(mediaIds);
            }).catch(err => {
              showToastError('Failed to start photo upload.');
              console.log(err);
            });
          },
        });
        return;
      }

      try {
        UploadPhotos(mediaIds);
      } catch (err) {
        showToastError('Failed to start photo upload.');
        console.log(err);
      }
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
