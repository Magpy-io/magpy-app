import React, { useCallback } from 'react';

import { InfoIcon, UploadIcon } from '~/Components/CommonComponents/Icons';
import { usePopupMessageModal } from '~/Components/CommonComponents/PopupMessageModal';
import SettingsPageComponent, {
  SettingsListType,
} from '~/Components/SettingsComponents/SettingsPageComponent';
import {
  useBackupWorkerContext,
  useBackupWorkerContextFunctions,
} from '~/Context/Contexts/BackupWorkerContext';
import { usePermissionsContext } from '~/Context/Contexts/PermissionsContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';
import { notOnServerGalleryPhotosSelector } from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { parseMillisecondsIntoReadableTime } from '~/Helpers/DateFunctions/DateFormatting';
import { useLastAutobackupExecutionTime } from '~/NativeModules/AutoBackupModule/';

export default function BackupSettingsScreen() {
  const { StartAutoBackup, StopAutoBackup } = useBackupWorkerContextFunctions();
  const { autobackupEnabled } = useBackupWorkerContext();
  const { isServerReachable } = useServerContext();

  const backupWorkerLastExecutionTime = useLastAutobackupExecutionTime();

  const { notificationsPermissionStatus, askNotificationsPermission } =
    usePermissionsContext();

  const { displayPopupMessage } = usePopupMessageModal();

  const notBackedupPhotos = useAppSelector(notOnServerGalleryPhotosSelector);
  const notBackedupPhotosCount = notBackedupPhotos.length;

  const onBackupPressAsync = useCallback(
    async (autoBackupEnabled: boolean) => {
      if (autoBackupEnabled) {
        if (notificationsPermissionStatus == 'PENDING') {
          const onDismissed = async () => {
            await askNotificationsPermission();
            await StartAutoBackup();
          };

          displayPopupMessage({
            title: 'Notification Permission Needed',
            content:
              'Allow Magpy to display notifications. This will be used to display the progress of the backing up of your photos.',
            onDismissed: () => {
              onDismissed().catch(console.log);
            },
          });
        } else {
          await StartAutoBackup();
        }
      } else {
        await StopAutoBackup();
      }
    },
    [
      StartAutoBackup,
      StopAutoBackup,
      askNotificationsPermission,
      displayPopupMessage,
      notificationsPermissionStatus,
    ],
  );

  const photosMessage = notBackedupPhotosCount == 1 ? 'photo' : 'photos';

  const notBackedUpPhotosMessage =
    notBackedupPhotosCount == 0
      ? 'All photos are backed up'
      : `You have ${notBackedupPhotosCount} ${photosMessage} not backed up`;

  const data: SettingsListType = [
    {
      title: 'Backup Settings',
      data: [
        {
          type: 'Switch',
          title: 'Automatic backup enabled',
          onPress: autoBackupEnabled => {
            onBackupPressAsync(autoBackupEnabled).catch(console.log);
          },
          icon: <UploadIcon />,
          initialState: autobackupEnabled,
          disabled: !isServerReachable,
        },
        {
          type: 'Label',
          title: notBackedUpPhotosMessage,
          icon: <InfoIcon />,
        },
      ],
    },
  ];

  if (autobackupEnabled && backupWorkerLastExecutionTime) {
    const timeDiffMillis = new Date().getTime() - backupWorkerLastExecutionTime.getTime();

    let timeSinceLastWorkerExecution;

    if (timeDiffMillis > 60000) {
      timeSinceLastWorkerExecution =
        parseMillisecondsIntoReadableTime(timeDiffMillis) + ' ago';
    } else {
      timeSinceLastWorkerExecution = 'just now';
    }

    data[0].data.push({
      type: 'Label',
      title: 'Backed up: ' + timeSinceLastWorkerExecution,
      icon: <InfoIcon />,
    });
  }

  return <SettingsPageComponent data={data} />;
}
