import React, { useCallback } from 'react';

import { UploadIcon } from '~/Components/CommonComponents/Icons';
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

export default function BackupSettingsScreen() {
  const { StartAutoBackup, StopAutoBackup } = useBackupWorkerContextFunctions();
  const { autobackupEnabled } = useBackupWorkerContext();
  const { isServerReachable } = useServerContext();

  const { notificationsPermissionStatus, askNotificationsPermission } =
    usePermissionsContext();

  const { displayPopup } = usePopupMessageModal();

  const onBackupPressAsync = useCallback(
    async (autoBackupEnabled: boolean) => {
      if (autoBackupEnabled) {
        if (notificationsPermissionStatus == 'PENDING') {
          const onDismissed = async () => {
            await askNotificationsPermission();
            await StartAutoBackup();
          };

          displayPopup({
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
      displayPopup,
      notificationsPermissionStatus,
    ],
  );

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
      ],
    },
  ];

  return <SettingsPageComponent data={data} />;
}
