import { NativeEventEmitter, NativeModules } from 'react-native';

const { MdnsServiceModule } = NativeModules;

const SERVICE_RESOLVED_EVENT_NAME = 'RNZeroconfResolved';
const SEARCH_STARTED_EVENT_NAME = 'RNZeroconfStart';
const SEARCH_STOPPED_EVENT_NAME = 'RNZeroconfStop';

export interface Service {
  name: string;
  fullName: string;
  addresses: string[];
  host: string;
  port: number;
  txt: {
    [key: string]: unknown;
  };
}

const emitter = new NativeEventEmitter();

export interface MdnsServiceModuleType {
  scan(type?: string, protocol?: string, domain?: string, impl?: string): void;
  stop(): void;
}

export const MdnsServiceEvents = {
  subscribeOnServiceResolved: (f: (service: Service) => void) => {
    return emitter.addListener(SERVICE_RESOLVED_EVENT_NAME, f);
  },

  subscribeOnSearchStarted: (f: () => void) => {
    return emitter.addListener(SEARCH_STARTED_EVENT_NAME, f);
  },

  subscribeOnSearchStopped: (f: () => void) => {
    return emitter.addListener(SEARCH_STOPPED_EVENT_NAME, f);
  },
};

const Module = MdnsServiceModule as MdnsServiceModuleType;

export { Module as MdnsServiceModule };
