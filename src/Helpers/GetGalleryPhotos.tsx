import { NativeModules } from 'react-native';

import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { DeleteMedia } from 'react-native-delete-media';
import RNFS from 'react-native-fs';

import { PhotoType } from './types';

const { MainModule } = NativeModules;

function GetPhotos(n: number, offset: number = 0) {
  return CameraRoll.getPhotos({
    first: n,
    after: String(offset),
    assetType: 'Photos',
    include: ['fileSize', 'filename', 'imageSize'],
  }).then(r => {
    return { edges: r.edges, endReached: !r.page_info.has_next_page };
  });
}

async function getFirstPossibleFileName(imageName: string) {
  const path = (await MainModule.getRestoredMediaAbsolutePath()) + '/' + imageName;

  if (!(await RNFS.exists(path))) {
    const pathSplit = path.split('/');
    if (pathSplit.length == 0) {
      throw new Error('getFirstPossibleFileName: Unexpected image path, cannot get imageName');
    }

    return pathSplit.pop() as string;
  }
  const pathSplitted = path.split('.');
  const extension = pathSplitted.pop();
  const pathWithoutExtension = pathSplitted.join('');

  let exists = true;
  let currentPath = path;
  let i = 1;
  while (exists) {
    currentPath = pathWithoutExtension + ` (${i++}).` + extension;
    exists = await RNFS.exists(currentPath);
  }

  const currentPathSplit = currentPath.split('/');

  if (currentPathSplit.length == 0) {
    throw new Error('getFirstPossibleFileName: Unexpected image path, cannot get imageName');
  }

  return currentPathSplit.pop() as string;
}

async function addPhoto(photo: PhotoType, image64: string) {
  const extention = photo.image.fileName.split('.').pop();
  const cachePhotoPath =
    RNFS.ExternalCachesDirectoryPath + `/temp_full_image_${photo.id}.${extention}`;
  await RNFS.writeFile(cachePhotoPath, image64, 'base64');
  const imageName = await getFirstPossibleFileName(photo.image.fileName);
  const path = await MainModule.saveToRestored(cachePhotoPath, {
    name: imageName,
  });
  await RNFS.unlink(cachePhotoPath);
  return 'file://' + path;
}

async function RemovePhotos(uris: Array<string | undefined>) {
  const urisThatExist = [];
  for (let i = 0; i < uris.length; i++) {
    const uri = uris[i];
    if (!uri) {
      continue;
    }
    if (await RNFS.exists(uri)) {
      urisThatExist.push(uri);
    }
  }

  if (urisThatExist.length == 0) {
    return;
  }

  return DeleteMedia.deletePhotos(urisThatExist);
}

async function addPhotoToCache(imageName: string, image: string) {
  const cachePhotoPath = RNFS.ExternalCachesDirectoryPath + `/${imageName}`;
  await RNFS.writeFile(cachePhotoPath, image, 'base64');
  return 'file://' + cachePhotoPath;
}

async function clearCache() {
  const results = await RNFS.readDir(RNFS.ExternalCachesDirectoryPath);

  for (let i = 0; i < results.length; i++) {
    await RNFS.unlink(results[i].path);
  }
}

export { GetPhotos, RemovePhotos, addPhoto, clearCache, addPhotoToCache };
