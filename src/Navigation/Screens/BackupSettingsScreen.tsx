import React from 'react';

import { UploadIcon } from '~/Components/CommonComponents/Icons';
import SettingsPageComponent, {
  SettingsListType,
} from '~/Components/SettingsComponents/SettingsPageComponent';
import {
  useBackupWorkerContext,
  useBackupWorkerContextFunctions,
} from '~/Context/Contexts/BackupWorkerContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';

export default function BackupSettingsScreen() {
  const { StartAutoBackup, StopAutoBackup } = useBackupWorkerContextFunctions();
  const { autobackupEnabled } = useBackupWorkerContext();

  const { isServerReachable } = useServerContext();

  const data: SettingsListType = [
    {
      title: 'Backup Settings',
      data: [
        {
          type: 'Switch',
          title: 'Automatic backup enabled',
          onPress: autoBackupEnabled => {
            if (autoBackupEnabled) {
              StartAutoBackup().catch(console.log);
            } else {
              StopAutoBackup().catch(console.log);
            }
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
