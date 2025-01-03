import RNFS from 'react-native-fs';

import { PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { MediaManagementModule } from '~/NativeModules/MediaManagementModule';

import { ClearFolderContent, DeleteFile } from '../FileSystemFunctions';
import { parsePhotoIdentifierToPhotoLocalType } from './GetGalleryPhotos';

export async function deletePhotosFromDevice(mediaIds: string[]) {
  await MediaManagementModule.deleteMedia(mediaIds);
}

export async function getFirstPossibleFileName(imageName: string) {
  const path = (await MediaManagementModule.getRestoredMediaAbsolutePath()) + '/' + imageName;

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

export async function addPhotoToDevice(photo: {
  fileName: string;
  id: string;
  image64: string;
}): Promise<PhotoLocalType> {
  const imageName = await getFirstPossibleFileName(photo.fileName);

  const cachePhotoPath = PhotosCacheFolder() + `/${imageName}`;
  await RNFS.writeFile(cachePhotoPath, photo.image64, 'base64');

  const imageData = await MediaManagementModule.saveToCameraRoll(cachePhotoPath, {
    type: 'photo',
    album: 'Restored',
  });

  await RNFS.unlink(cachePhotoPath);
  return parsePhotoIdentifierToPhotoLocalType(imageData);
}

export async function addPhotoThumbnailToCache(id: string, image: string) {
  await CheckPhotosCacheFolderExists();
  const cachePhotoPath = PhotosCacheFolder() + `/thumbnail_${id}`;
  await RNFS.writeFile(cachePhotoPath, image, 'base64');
  return 'file://' + cachePhotoPath;
}

export async function addPhotoCompressedToCache(id: string, image: string) {
  await CheckPhotosCacheFolderExists();
  const cachePhotoPath = PhotosCacheFolder() + `/compressed_${id}`;
  await RNFS.writeFile(cachePhotoPath, image, 'base64');
  return 'file://' + cachePhotoPath;
}

export async function photoThumbnailExistsInCache(id: string): Promise<string | null> {
  const cachePhotoPath = PhotosCacheFolder() + `/thumbnail_${id}`;
  const exists = await RNFS.exists(cachePhotoPath);

  if (exists) {
    return 'file://' + cachePhotoPath;
  } else {
    return null;
  }
}

export async function photoCompressedExistsInCache(id: string): Promise<string | null> {
  const cachePhotoPath = PhotosCacheFolder() + `/compressed_${id}`;
  const exists = await RNFS.exists(cachePhotoPath);

  if (exists) {
    return 'file://' + cachePhotoPath;
  } else {
    return null;
  }
}

export async function deletePhotoThumbnailFromCache(id: string) {
  const cachePhotoPath = PhotosCacheFolder() + `/thumbnail_${id}`;
  await DeleteFile(cachePhotoPath);
}

export async function deletePhotoCompressedFromCache(id: string) {
  const cachePhotoPath = PhotosCacheFolder() + `/compressed_${id}`;

  await DeleteFile(cachePhotoPath);
}

export async function clearCache() {
  await ClearFolderContent(PhotosCacheFolder());
}

async function CheckPhotosCacheFolderExists() {
  await RNFS.mkdir(PhotosCacheFolder());
}

function PhotosCacheFolder() {
  return RNFS.ExternalCachesDirectoryPath + '/CachedPhotos';
}
