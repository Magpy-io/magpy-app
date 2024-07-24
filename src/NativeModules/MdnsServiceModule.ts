import { NativeEventEmitter, NativeModules } from 'react-native';

const { MdnsServiceModule } = NativeModules;

const MDNS_DISCOVERY_STARTED_EVENT_NAME = 'MDNS_DISCOVERY_STARTED_EVENT_NAME';
const MDNS_DISCOVERY_STOPPED_EVENT_NAME = 'MDNS_DISCOVERY_STOPPED_EVENT_NAME';
const MDNS_ERROR_EVENT_NAME = 'MDNS_ERROR_EVENT_NAME';
const MDNS_DEVICE_FOUND_EVENT_NAME = 'MDNS_DEVICE_FOUND_EVENT_NAME';
const MDNS_DEVICE_REMOVED_EVENT_NAME = 'MDNS_DEVICE_REMOVED_EVENT_NAME';
const MDNS_DEVICE_RESOLVED_EVENT_NAME = 'MDNS_DEVICE_RESOLVED_EVENT_NAME';

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
  scan(type?: string, protocol?: string, domain?: string): void;
  stop(): void;
}

export const MdnsServiceEvents = {
  subscribeOnSearchStarted: (f: () => void) => {
    return emitter.addListener(MDNS_DISCOVERY_STARTED_EVENT_NAME, f);
  },

  subscribeOnSearchStopped: (f: () => void) => {
    return emitter.addListener(MDNS_DISCOVERY_STOPPED_EVENT_NAME, f);
  },

  subscribeOnError: (f: (err: string) => void) => {
    return emitter.addListener(MDNS_ERROR_EVENT_NAME, f);
  },

  subscribeOnDeviceFound: (f: (service: Service) => void) => {
    return emitter.addListener(MDNS_DEVICE_FOUND_EVENT_NAME, f);
  },

  subscribeOnDeviceRemoved: (f: (service: Service) => void) => {
    return emitter.addListener(MDNS_DEVICE_REMOVED_EVENT_NAME, f);
  },

  subscribeOnServiceResolved: (f: (service: Service) => void) => {
    return emitter.addListener(MDNS_DEVICE_RESOLVED_EVENT_NAME, f);
  },
};

const Module = MdnsServiceModule as MdnsServiceModuleType;

export { Module as MdnsServiceModule };
