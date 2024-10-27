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
import { useServerInvalidationContext } from '~/Context/Contexts/ServerInvalidationContext';
import { notOnServerGalleryPhotosSelector } from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { parseMillisecondsIntoReadableTime } from '~/Helpers/DateFunctions/DateFormatting';
import { useDebouncedDelayed } from '~/Hooks/useDebouncedDelayed';
import { useLastAutobackupExecutionTime } from '~/NativeModules/AutoBackupModule/';

export default function BackupSettingsScreen() {
  const { StartAutoBackup, StopAutoBackup } = useBackupWorkerContextFunctions();
  const { autobackupEnabled, autoBackupWorkerRunning } = useBackupWorkerContext();
  const { isServerReachable, hasServer } = useServerContext();

  const backupWorkerLastExecutionTime = useLastAutobackupExecutionTime();

  const { notificationsPermissionStatus, askNotificationsPermission } =
    usePermissionsContext();

  const { displayPopupMessage } = usePopupMessageModal();

  const { isRefreshing } = useServerInvalidationContext();

  const notBackedupPhotos = useAppSelector(notOnServerGalleryPhotosSelector);
  const notBackedupPhotosCount = notBackedupPhotos.length;

  const StartAutoBackupAsync = useCallback(async () => {
    if (notificationsPermissionStatus == 'PENDING') {
      const onDismissed = async () => {
        await askNotificationsPermission();
        await StartAutoBackup(true);
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
      await StartAutoBackup(true);
    }
  }, [
    StartAutoBackup,
    askNotificationsPermission,
    displayPopupMessage,
    notificationsPermissionStatus,
  ]);

  const onBackupPressAsync = useCallback(
    async (autoBackupEnabled: boolean) => {
      if (autoBackupEnabled) {
        await StartAutoBackupAsync();
      } else {
        await StopAutoBackup();
      }
    },
    [StartAutoBackupAsync, StopAutoBackup],
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
          disabled: !isServerReachable && !autobackupEnabled,
        },
      ],
    },
  ];

  if (isServerReachable && !isRefreshing) {
    data[0].data.push({
      type: 'Label',
      title: notBackedUpPhotosMessage,
      icon: <InfoIcon />,
    });
  }

  if (autoBackupWorkerRunning) {
    data[0].data.push({
      type: 'Label',
      title: 'Backup Running',
      icon: <InfoIcon />,
    });
  } else {
    if (hasServer && autobackupEnabled && backupWorkerLastExecutionTime) {
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
  }

  // Worker state changes rapidly and causes the button to appear and then disappear rapidly
  // This debouncing avoids that

  const {
    autobackupEnabled: autobackupEnabledDebounced,
    autoBackupWorkerRunning: autoBackupWorkerRunningDebounced,
  } = useDebouncedDelayed({ autobackupEnabled, autoBackupWorkerRunning }, 300);

  if (
    isServerReachable &&
    !isRefreshing &&
    autobackupEnabledDebounced &&
    !autoBackupWorkerRunningDebounced &&
    notBackedupPhotosCount != 0 &&
    autobackupEnabled
  ) {
    data[0].data.push({
      type: 'Button',
      align: 'right',
      title: 'Backup now',
      onPress: () => {
        StartAutoBackupAsync().catch(console.log);
      },
    });
  }

  return <SettingsPageComponent data={data} />;
}
