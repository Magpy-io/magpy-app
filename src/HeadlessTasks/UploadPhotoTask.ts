import { NativeModules } from 'react-native';

import RNFS from 'react-native-fs';

import * as Queries from '~/Helpers/Queries';

const { MainModule } = NativeModules;

export async function UploadPhotoTask(photo: {
  path: string;
  mediaId: string;
  name: string;
  date: string;
  height: number;
  width: number;
  size: number;
}) {
  try {
    const res = await RNFS.readFile(photo.path, 'base64');

    const result = await Queries.addPhotoWithProgress({
      name: photo.name,
      fileSize: photo.size,
      width: photo.width,
      height: photo.height,
      date: new Date(photo.date).toJSON(),
      mediaId: photo.mediaId,
      image64: res,
    });

    if (result.ok && result.data.done) {
      MainModule.onJsTaskFinished({ code: 'SUCCESS', id: result.data.photo.id });
      console.log('UploadPhotoTask: photo uploaded');
    } else {
      MainModule.onJsTaskFinished({ code: 'ERROR', id: '' });
      console.log('UploadPhotoTask: photo upload error');
      console.log((result as typeof result & { ok: false }).errorCode);
    }
  } catch (e) {
    console.log('UploadPhotoTask: Error thrown:', e);
  }
}
