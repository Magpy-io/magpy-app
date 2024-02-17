import { NativeModules } from 'react-native';

import RNFS from 'react-native-fs';

import { getPhotoFromDevice } from '~/Helpers/GalleryFunctions/GetGalleryPhotos';
import * as Queries from '~/Helpers/Queries';

const { MainModule } = NativeModules;

export async function UploadPhotoTask(photo: { mediaId: string }) {
  try {
    const photoLocal = await getPhotoFromDevice(photo.mediaId);

    const res = await RNFS.readFile(photoLocal.uri, 'base64');

    const result = await Queries.addPhotoWithProgress({
      name: photoLocal.fileName,
      fileSize: photoLocal.fileSize,
      width: photoLocal.width,
      height: photoLocal.height,
      date: new Date(photoLocal.date).toJSON(),
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
