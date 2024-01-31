import { NativeModules } from 'react-native';

import RNFS from 'react-native-fs';

import * as Queries from '~/Helpers/Queries';

const { MainModule } = NativeModules;

export async function UploadPhotoTask(photo: {
  path: string;
  name: string;
  date: string;
  height: number;
  width: number;
  size: number;
}) {
  const res = await RNFS.readFile(photo.path, 'base64');

  const result = await Queries.addPhotoWithProgress({
    name: photo.name,
    fileSize: photo.size,
    width: photo.width,
    height: photo.height,
    date: new Date(photo.date).toJSON(),
    path: photo.path,
    image64: res,
  });

  if (result.ok && result.data.done) {
    MainModule.onJsTaskFinished({ code: 'SUCCESS', id: result.data.photo.id });
    console.log('photo uploaded');
  } else {
    MainModule.onJsTaskFinished({ code: 'ERROR', id: '' });
    console.log('photo upload error');
    console.log((result as typeof result & { ok: false }).errorCode);
  }
}
