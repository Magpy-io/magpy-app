import { useCallback } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { AutoBackupModule } from '~/NativeModules/AutoBackupModule';

import { useServerContext } from '../ServerContext';
import {
  useBackupWorkerContextInner,
  useBackupWorkerContextSettersInner,
} from './BackupWorkerContext';

export function useBackupWorkerContextFunctions() {
  const { setAutobackupEnabled } = useBackupWorkerContextSettersInner();

  const { isServerReachable, serverPath, token } = useServerContext();

  const StartAutoBackup = useCallback(async () => {
    if (isServerReachable) {
      await AutoBackupModule.StartBackupWorker({
        url: serverPath ?? '',
        deviceId: uniqueDeviceId,
        serverToken: token ?? '',
      });

      const isStarted = await AutoBackupModule.IsWorkerAlive();

      if (isStarted) {
        console.log('worker started');
        setAutobackupEnabled(true);
        return;
      }

      throw new Error('Error while starting autobackup worker');
    }
  }, [isServerReachable, serverPath, setAutobackupEnabled, token]);

  const StopAutoBackup = useCallback(async () => {
    await AutoBackupModule.StopWorker();

    const isStarted = await AutoBackupModule.IsWorkerAlive();

    if (!isStarted) {
      console.log('worker stopped');
      setAutobackupEnabled(false);
      return;
    }

    throw new Error('Error while stopping autobackup worker');
  }, [setAutobackupEnabled]);

  return { StartAutoBackup, StopAutoBackup };
}

export function useBackupWorkerContext() {
  const { autobackupEnabled } = useBackupWorkerContextInner();

  return { autobackupEnabled };
}
