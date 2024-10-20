import { NativeEventEmitter, NativeModules } from 'react-native';

const { AutoBackupModule } = NativeModules;

const WORKER_STATUS_CHANGED_NAME = 'AUTO_BACKUP_WORKER_STATUS_CHANGED';

export type WorkerStatus =
  | 'WORKER_ENQUEUED'
  | 'WORKER_RUNNING'
  | 'WORKER_FAILED'
  | 'WORKER_SUCCESS'
  | 'WORKER_CANCELED';

export function isWorkerStatusFinished(workerStatus: WorkerStatus) {
  return (
    workerStatus == 'WORKER_CANCELED' ||
    workerStatus == 'WORKER_FAILED' ||
    workerStatus == 'WORKER_SUCCESS'
  );
}

export interface AutoBackupModuleType {
  StartBackupWorker: (data: {
    url: string;
    serverToken: string;
    deviceId: string;
    restartWorker?: boolean;
  }) => Promise<void>;
  IsWorkerAlive: () => Promise<boolean>;
  StopWorker: () => Promise<void>;
  GetWorkerInfo: () => Promise<{
    state: WorkerStatus;
    nextScheduleMillis: number;
    repeatIntervalMillis: number;
    stopReason: number;
  } | null>;
  GetWorkerStats: () => Promise<{
    lastExecutionTime: number | null;
    lastExecutionTimes: number[];
  }>;
}

const emitter = new NativeEventEmitter();

export const AutoBackupModuleEvents = {
  subscribeOnWorkerStatusChanged: (f: (event: { status: WorkerStatus }) => void) => {
    return emitter.addListener(WORKER_STATUS_CHANGED_NAME, f);
  },
};

const Module = AutoBackupModule as AutoBackupModuleType;

export { Module as AutoBackupModule };
