import { NativeEventEmitter, NativeModules } from 'react-native';

import { APIPhoto } from '~/Helpers/ServerQueries/Types';

import { writeWorkerDataInput } from './Utils';

const { UploadMediaModule: UploadMediaModuleTypeNative } = NativeModules;

const PHOTO_UPLOADED_EVENT_NAME = 'PHOTO_UPLOADED_EVENT_NAME';
const WORKER_STATUS_CHANGED_NAME = 'UPLOAD_WORKER_STATUS_CHANGED';

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

export interface UploadMediaModuleType {
  StartUploadWorker: (data: {
    url: string;
    serverToken: string;
    deviceId: string;
    photosIdsFilePath: string;
  }) => Promise<void>;
  IsWorkerAlive: () => Promise<boolean>;
  StopWorker: () => Promise<void>;
}

const emitter = new NativeEventEmitter();

export const UploadMediaEvents = {
  subscribeOnPhotoUploaded: (f: (event: { mediaId: string; photo: APIPhoto }) => void) => {
    return emitter.addListener(
      PHOTO_UPLOADED_EVENT_NAME,
      (event: { mediaId: string; photo: string }) => {
        f({ mediaId: event.mediaId, photo: JSON.parse(event.photo) as APIPhoto });
      },
    );
  },
  subscribeOnWorkerStatusChanged: (f: (event: { status: WorkerStatus }) => void) => {
    return emitter.addListener(WORKER_STATUS_CHANGED_NAME, f);
  },
};

const { StartUploadWorker, IsWorkerAlive, StopWorker } =
  UploadMediaModuleTypeNative as UploadMediaModuleType;

export const UploadMediaModule = {
  IsWorkerAlive,
  StopWorker,
  StartUploadWorker: async ({
    url,
    serverToken,
    deviceId,
    photosIds,
  }: {
    url: string;
    serverToken: string;
    deviceId: string;
    photosIds: string[];
  }) => {
    const photosIdsFilePath = await writeWorkerDataInput(photosIds);
    await StartUploadWorker({ url, serverToken, deviceId, photosIdsFilePath });
  },
};
