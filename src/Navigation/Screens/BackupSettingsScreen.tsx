import React, { useCallback, useState } from 'react';

import { UploadIcon } from '~/Components/CommonComponents/Icons';
import PopupMessageModal from '~/Components/CommonComponents/PopupMessageModal/PopupMessageModal';
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

  const [isVisiblePopups, setIsVisblePopup] = useState(false);

  const { isServerReachable } = useServerContext();

  const { notificationsPermissionStatus, askNotificationsPermission } =
    usePermissionsContext();

  const onPopupDismissed = useCallback(async () => {
    setIsVisblePopup(false);

    await askNotificationsPermission();
    await StartAutoBackup();
  }, [StartAutoBackup, askNotificationsPermission]);

  const onBackupPressAsync = useCallback(
    async (autoBackupEnabled: boolean) => {
      if (autoBackupEnabled) {
        if (notificationsPermissionStatus == 'PENDING') {
          setIsVisblePopup(true);
          return;
        }

        await StartAutoBackup();
      } else {
        await StopAutoBackup();
      }
    },
    [StartAutoBackup, StopAutoBackup, notificationsPermissionStatus],
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

  return (
    <>
      <SettingsPageComponent data={data} />
      <PopupMessageModal
        isVisible={isVisiblePopups}
        onDismissed={() => {
          onPopupDismissed().catch(console.log);
        }}
        title="Notification Permission Needed"
        content="dfjlk fdlksj flksdjf lkjsdlf jlsdjmfj"
        ok="Ok"
      />
    </>
  );
}
