import { NativeModules } from 'react-native';

const { MediaManagementModule } = NativeModules;

export interface MediaManagementModuleType {
  getRestoredMediaAbsolutePath: () => Promise<string>;
  getPhotoById: (id: string) => Promise<LocalPhotoById>;
  deleteMedia: (ids: string[]) => Promise<void>;
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

const Module = MediaManagementModule as MediaManagementModuleType;

export { Module as MediaManagementModule };
