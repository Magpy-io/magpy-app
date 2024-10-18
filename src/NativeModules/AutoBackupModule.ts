import { NativeModules } from 'react-native';

const { AutoBackupModule } = NativeModules;

export interface AutoBackupModuleType {
  StartBackupWorker: (data: {
    url: string;
    serverToken: string;
    deviceId: string;
  }) => Promise<void>;
  IsWorkerAlive: () => Promise<boolean>;
  StopWorker: () => Promise<void>;
  GetWorkerInfo: () => Promise<{
    state: string;
    nextScheduleMillis: number;
    repeatIntervalMillis: number;
    stopReason: number;
  }>;
  GetWorkerStats: () => Promise<{
    lastExecutionTime: number;
    lastExecutionTimes: number[];
  }>;
}

const Module = AutoBackupModule as AutoBackupModuleType;

export { Module as AutoBackupModule };
