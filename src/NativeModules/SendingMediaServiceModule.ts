import { NativeModules } from 'react-native';

const { SendingMediaServiceModule } = NativeModules;

export interface SendingMediaServiceModuleType {
  onJsTaskFinished: (param: { code: string; id: string }) => void;
  startSendingMediaService: (
    photos: {
      id: string;
    }[],
  ) => Promise<void>;
  stopSendingMediaService: () => Promise<void>;
  getServiceState: () => Promise<'STARTUP' | 'DESTROYED' | 'INACTIVE' | 'FAILED'>;
  getIds: () => Promise<string[]>;
  getCurrentIndex: () => Promise<number>;
}

const Module = SendingMediaServiceModule as SendingMediaServiceModuleType;

export { Module as SendingMediaServiceModule };
