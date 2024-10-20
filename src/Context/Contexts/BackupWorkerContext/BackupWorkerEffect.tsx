import React, { ReactNode, useEffect, useMemo, useRef } from 'react';

import { AutoBackupModule, AutoBackupModuleEvents } from '~/NativeModules/AutoBackupModule';

import { useServerContext } from '../ServerContext';
import { useBackupWorkerContextInner } from './BackupWorkerContext';
import {
  useBackupWorkerContext,
  useBackupWorkerContextFunctions,
} from './useBackupWorkerContext';

type PropsType = {
  children: ReactNode;
};

export const BackupWorkerEffect: React.FC<PropsType> = props => {
  const { autobackupEnabled } = useBackupWorkerContext();
  const { setWorkerStatus } = useBackupWorkerContextInner();
  const { StartAutoBackup } = useBackupWorkerContextFunctions();

  const { isServerReachable, serverPath, token } = useServerContext();

  const serverInfo = useMemo(() => {
    return { serverPath, token };
  }, [serverPath, token]);

  const lastServerInfoRef = useRef(serverInfo);
  const lastIsServerReachable = useRef(isServerReachable);

  // This effect will update the server network data of worker
  // whenever the server network data changes or the reachable status goes from false to true
  useEffect(() => {
    if (
      isServerReachable &&
      autobackupEnabled &&
      (lastServerInfoRef.current !== serverInfo ||
        lastIsServerReachable.current !== isServerReachable)
    ) {
      StartAutoBackup().catch(console.log);
    }
    lastServerInfoRef.current = serverInfo;
    lastIsServerReachable.current = isServerReachable;
  }, [StartAutoBackup, autobackupEnabled, isServerReachable, serverInfo]);

  useEffect(() => {
    const subscriptionWorkerStatus = AutoBackupModuleEvents.subscribeOnWorkerStatusChanged(
      ({ status }) => {
        setWorkerStatus(status);
      },
    );

    // Initial worker status
    AutoBackupModule.GetWorkerInfo()
      .then(workerInfo => {
        if (!workerInfo) {
          setWorkerStatus('WORKER_SUCCESS');
        } else {
          setWorkerStatus(workerInfo.state);
        }
      })
      .catch(console.log);

    return () => {
      subscriptionWorkerStatus.remove();
    };
  }, [setWorkerStatus]);

  return props.children;
};
