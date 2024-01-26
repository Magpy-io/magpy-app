import { NativeModules } from 'react-native';

import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { DeleteMedia } from 'react-native-delete-media';
import RNFS from 'react-native-fs';

import { PhotoType } from './types';

const { MainModule } = NativeModules;

export function GalleryGetPhotos(n: number, offset: number = 0) {
  return CameraRoll.getPhotos({
    first: n,
    after: String(offset),
    assetType: 'Photos',
    include: ['fileSize', 'filename', 'imageSize'],
  }).then(r => {
    return { edges: r.edges, endReached: !r.page_info.has_next_page };
  });
}

export async function getFirstPossibleFileName(imageName: string) {
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

export async function addPhotoToDevice(photo: PhotoType, image64: string) {
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

export async function DeletePhotosFromDevice(uris: Array<string | undefined>) {
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

export async function addPhotoThumbnailToCache(id: string, image: string) {
  const cachePhotoPath = RNFS.ExternalCachesDirectoryPath + `/thumbnail_${id}`;
  await RNFS.writeFile(cachePhotoPath, image, 'base64');
  return 'file://' + cachePhotoPath;
}

export async function addPhotoCompressedToCache(id: string, image: string) {
  const cachePhotoPath = RNFS.ExternalCachesDirectoryPath + `/compressed_${id}`;
  await RNFS.writeFile(cachePhotoPath, image, 'base64');
  return 'file://' + cachePhotoPath;
}

export async function photoThumbnailExistsInCache(id: string) {
  const cachePhotoPath = RNFS.ExternalCachesDirectoryPath + `/thumbnail_${id}`;
  const exists = await RNFS.exists(cachePhotoPath);

  return { exists: exists, uri: 'file://' + cachePhotoPath };
}

export async function photoCompressedExistsInCache(id: string) {
  const cachePhotoPath = RNFS.ExternalCachesDirectoryPath + `/compressed_${id}`;
  const exists = await RNFS.exists(cachePhotoPath);

  return { exists: exists, uri: 'file://' + cachePhotoPath };
}

export async function clearCache() {
  const results = await RNFS.readDir(RNFS.ExternalCachesDirectoryPath);

  for (let i = 0; i < results.length; i++) {
    await RNFS.unlink(results[i].path);
  }
}
