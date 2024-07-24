import { NativeModules } from 'react-native';

const { FullScreenModule } = NativeModules;

export interface FullScreenModuleType {
  disableFullScreen: () => Promise<void>;
  enableFullScreen: () => Promise<void>;
  getWindowInsets: () => Promise<{
    valid: boolean;
    top: number;
    bottom: number;
    left: number;
    right: number;
    isFullScreen: boolean;
  }>;
}

const Module = FullScreenModule as FullScreenModuleType;

export { Module as FullScreenModule };
