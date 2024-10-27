import React, { ReactNode, useEffect, useMemo } from 'react';

import { useHasValueChanged } from '~/Hooks/useHasValueChanged';
import { useToast } from '~/Hooks/useToast';
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

  const { showToastError } = useToast();

  const { isServerReachable, serverPath, token } = useServerContext();

  const serverInfo = useMemo(() => {
    return { serverPath, token };
  }, [serverPath, token]);

  const serverInfoChanged = useHasValueChanged(serverInfo, null);
  const hasServerReachableChanged = useHasValueChanged(isServerReachable, false);

  // This effect will update the server network data of worker
  // whenever the server network data changes or the reachable status goes from false to true
  useEffect(() => {
    if (
      isServerReachable &&
      autobackupEnabled &&
      (serverInfoChanged || hasServerReachableChanged)
    ) {
      StartAutoBackup().catch(console.log);
    }
  }, [
    StartAutoBackup,
    autobackupEnabled,
    isServerReachable,
    serverInfo,
    serverInfoChanged,
    hasServerReachableChanged,
  ]);

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

  useEffect(() => {
    const sub = AutoBackupModuleEvents.subscribeOnWorkerError(({ error }) => {
      if (error == 'ERROR_AUTOBACKUP_WORKER_SERVER_UNREACHABLE') {
        showToastError('Autobackup failed, server not reachable.');
      } else {
        showToastError('Autobackup failed, unexpected error');
      }
    });

    return () => {
      sub.remove();
    };
  }, [showToastError]);

  return props.children;
};
