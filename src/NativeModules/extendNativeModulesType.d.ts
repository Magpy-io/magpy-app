import 'react-native';

export interface MainModuleType {
  getRestoredMediaAbsolutePath: () => Promise<string>;
  onJsTaskFinished: (param: { code: string; id: string }) => void;
  disableFullScreen: () => Promise<void>;
  enableFullScreen: () => Promise<void>;
  startSendingMediaService: (
    photos: {
      id: string;
    }[],
  ) => Promise<void>;
  stopSendingMediaService: () => Promise<void>;
  getServiceState: () => Promise<'STARTUP' | 'DESTROYED' | 'INACTIVE' | 'FAILED'>;
  getIds: () => Promise<string[]>;
  getCurrentIndex: () => Promise<number>;
  getPhotoById: (id: string) => Promise<LocalPhotoById>;
  getWindowInsets: () => Promise<{
    valid: boolean;
    top: number;
    bottom: number;
    left: number;
    right: number;
    isFullScreen: boolean;
  }>;
  getPhotoExifDate: (uri: string) => Promise<number>;
  deleteMedia: (uris: string[]) => Promise<void>;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    MainModule: MainModuleType;
  }
}

export type LocalPhotoById = {
  id: string;
  type: string;
  group_name: string[];
  timestamp: number;
  modificationTimestamp: number;
  uri: string;
  filename: string;
  fileSize: number;
  width: number;
  height: number;
};
