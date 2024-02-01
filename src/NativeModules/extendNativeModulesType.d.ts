import 'react-native';

export interface MainModuleType {
  getRestoredMediaAbsolutePath: () => Promise<string>;
  onJsTaskFinished: (param: { code: string; id: string }) => void;
  disableFullScreen: () => Promise<void>;
  enableFullScreen: () => Promise<void>;
  startSendingMediaService: (photoMediaIds: string[]) => Promise<void>;
  stopSendingMediaService: () => Promise<void>;
  getServiceState: () => Promise<'STARTUP' | 'DESTROYED' | 'INACTIVE' | 'FAILED'>;
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
