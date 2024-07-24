import { NativeModules } from 'react-native';

const { MdnsServiceModule } = NativeModules;

export interface MdnsServiceModuleType {
  scan(type?: string, protocol?: string, domain?: string): void;
  stop(): void;
  removeDeviceListeners(): void;
}

const Module = MdnsServiceModule as MdnsServiceModuleType;

export { Module as MdnsServiceModule };
