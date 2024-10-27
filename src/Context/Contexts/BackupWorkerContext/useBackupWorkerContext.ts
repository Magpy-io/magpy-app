import { useCallback, useMemo } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { AutoBackupModule, isWorkerStatusFinished } from '~/NativeModules/AutoBackupModule';

import { useServerContext } from '../ServerContext';
import { useBackupWorkerContextInner } from './BackupWorkerContext';

export function useBackupWorkerContextFunctions() {
  const { setWorkerStatus } = useBackupWorkerContextInner();

  const { hasServer, serverPath, token } = useServerContext();

  const StartAutoBackup = useCallback(
    async (restartWorker?: boolean) => {
      if (hasServer) {
        await AutoBackupModule.StartBackupWorker({
          url: serverPath ?? '',
          deviceId: uniqueDeviceId,
          serverToken: token ?? '',
          restartWorker,
        });

        const isStarted = await AutoBackupModule.IsWorkerAlive();

        if (isStarted) {
          console.log('worker started');
          return;
        }

        throw new Error('Error while starting autobackup worker');
      }
    },
    [hasServer, serverPath, token],
  );

  const StopAutoBackup = useCallback(async () => {
    await AutoBackupModule.StopWorker();

    const isStarted = await AutoBackupModule.IsWorkerAlive();

    if (!isStarted) {
      console.log('worker stopped');
      setWorkerStatus('WORKER_CANCELED');
      return;
    }

    throw new Error('Error while stopping autobackup worker');
  }, [setWorkerStatus]);

  return { StartAutoBackup, StopAutoBackup };
}

export function useBackupWorkerContext() {
  const { workerStatus } = useBackupWorkerContextInner();

  const autobackupEnabled: boolean = useMemo(() => {
    if (!workerStatus) {
      return false;
    }
    return !isWorkerStatusFinished(workerStatus);
  }, [workerStatus]);

  const autoBackupWorkerRunning = useMemo(() => {
    return workerStatus == 'WORKER_RUNNING';
  }, [workerStatus]);

  return { autobackupEnabled, autoBackupWorkerRunning };
}
