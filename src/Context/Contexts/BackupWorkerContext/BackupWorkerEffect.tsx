import React, { ReactNode, useEffect, useMemo, useRef } from 'react';

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

  const serverInfo = useMemo(() => {
    return { serverPath, token };
  }, [serverPath, token]);

  const lastServerInfoRef = useRef(serverInfo);
  const lastIsServerREachable = useRef(isServerReachable);

  // This effect will update the server network data of worker
  // whenever the server network data changes or the reachable status goes from false to true
  useEffect(() => {
    if (
      isServerReachable &&
      autobackupEnabled &&
      (lastServerInfoRef.current !== serverInfo ||
        lastIsServerREachable.current !== isServerReachable)
    ) {
      StartAutoBackup().catch(console.log);
    }
    lastServerInfoRef.current = serverInfo;
    lastIsServerREachable.current = isServerReachable;
  }, [StartAutoBackup, autobackupEnabled, isServerReachable, serverInfo]);

  useEffect(() => {
    AutoBackupModule.IsWorkerAlive()
      .then(alive => setAutobackupEnabled(alive))
      .catch(console.log);
  }, [setAutobackupEnabled]);

  return props.children;
};
