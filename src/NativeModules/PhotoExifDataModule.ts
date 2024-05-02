import { NativeModules } from 'react-native';

const { PhotoExifDataModule } = NativeModules;

export interface PhotoExifDataModuleType {
  getPhotoExifDate: (uri: string) => Promise<number>;
}

const Module = PhotoExifDataModule as PhotoExifDataModuleType;

export { Module as PhotoExifDataModule };
