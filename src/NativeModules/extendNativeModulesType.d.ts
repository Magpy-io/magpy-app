import 'react-native';

export interface MainModuleType {
  getRestoredMediaAbsolutePath: () => Promise<string>;
  onJsTaskFinished: (param: { code: string }) => void;
  disableFullScreen: () => Promise<void>;
  enableFullScreen: () => Promise<void>;
  startSendingMediaService: (
    photos: {
      id: string;
      name: string;
      date: string;
      path: string;
      width: number;
      height: number;
      size: number;
    }[],
  ) => Promise<void>;
  stopSendingMediaService: () => Promise<void>;
  getServiceState: () => Promise<string>;
  getIds: () => Promise<string[]>;
  getCurrentIndex: () => Promise<number>;
  getWindowInsets: () => Promise<{
    valid: boolean;
    top: number;
    bottom: number;
    left: number;
    right: number;
    isFullScreen: boolean;
  }>;
  saveToRestored: (photoPath: string, data: { name: string }) => Promise<void>;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    MainModule: MainModuleType;
  }
}
