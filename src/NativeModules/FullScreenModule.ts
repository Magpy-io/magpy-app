import { NativeEventEmitter, NativeModules } from 'react-native';

const { FullScreenModule } = NativeModules;

const FULL_SCREEN_CHANGED_EVENT_NAME = 'FULL_SCREEN_CHANGED_EVENT';

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

const emitter = new NativeEventEmitter();

export const FullScreenModuleEvents = {
  subscribeOnFullscreenChanged: (f: (event: { isFullScreen: boolean }) => void) => {
    return emitter.addListener(FULL_SCREEN_CHANGED_EVENT_NAME, f);
  },
};

const Module = FullScreenModule as FullScreenModuleType;

export { Module as FullScreenModule };
