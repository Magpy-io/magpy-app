import React, { ReactNode, useEffect } from 'react';

import { AutoBackupModule } from '~/NativeModules/AutoBackupModule';

import { useServerContext } from '../ServerContext';
import { useBackupWorkerContextSettersInner } from './BackupWorkerContext';
import {
  useBackupWorkerContext,
  useBackupWorkerContextFunctions,
} from './useBackupWorkerContext';

type PropsType = {
  children: ReactNode;
};

export const BackupWorkerEffect: React.FC<PropsType> = props => {
  const { autobackupEnabled } = useBackupWorkerContext();
  const { setAutobackupEnabled } = useBackupWorkerContextSettersInner();
  const { StartAutoBackup } = useBackupWorkerContextFunctions();

  const { isServerReachable, serverPath, token } = useServerContext();

  // This effect will update the server network data of worker
  // whenever the server network data changes
  useEffect(() => {
    if (isServerReachable && autobackupEnabled) {
      StartAutoBackup().catch(console.log);
    }
  }, [StartAutoBackup, autobackupEnabled, isServerReachable, serverPath, token]);

  useEffect(() => {
    AutoBackupModule.IsWorkerAlive()
      .then(alive => setAutobackupEnabled(alive))
      .catch(console.log);
  }, [setAutobackupEnabled]);

  return props.children;
};
