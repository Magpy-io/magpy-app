import { NativeModules } from 'react-native';

const { AutoBackupModule } = NativeModules;

export interface AutoBackupModuleType {
  StartBackupWorker: () => Promise<void>;
  IsWorkerAlive: () => Promise<boolean>;
  StopWorker: () => Promise<void>;
}

const Module = AutoBackupModule as AutoBackupModuleType;

export { Module as AutoBackupModule };
