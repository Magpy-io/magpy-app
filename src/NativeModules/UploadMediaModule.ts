import { NativeEventEmitter, NativeModules } from 'react-native';

const { UploadMediaModule } = NativeModules;

const PHOTO_UPLOADED_EVENT_NAME = 'PHOTO_UPLOADED_EVENT_NAME';

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

const emitter = new NativeEventEmitter();

export const UploadMediaEvents = {
  subscribeOnPhotoUploaded: (f: (event: { mediaId: string }) => void) => {
    return emitter.addListener(PHOTO_UPLOADED_EVENT_NAME, f);
  },
};

const Module = UploadMediaModule as UploadMediaModuleType;

export { Module as UploadMediaModule };
