import { NativeModules } from 'react-native';

const { UploadMediaModule } = NativeModules;

export interface UploadMediaModuleType {
  StartUploadWorker: (data: {
    url: string;
    serverToken: string;
    deviceId: string;
    photosIds: string[];
  }) => Promise<void>;
  IsWorkerAlive: () => Promise<boolean>;
  StopWorker: () => Promise<void>;
}

const Module = UploadMediaModule as UploadMediaModuleType;

export { Module as UploadMediaModule };
