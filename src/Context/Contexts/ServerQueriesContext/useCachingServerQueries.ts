import { useCallback } from 'react';

import RNFS from 'react-native-fs';

import { PhotoServerType, setPhotosServer } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';

const CACHE_FILE_NAME = 'cache';
const CACHE_FOLDER_NAME = 'CachedServerPhotosList';

export function useCachingServerQueries() {
  const dispatch = useAppDispatch();

  const LoadCachedServerPhotos = useCallback(async () => {
    const serverPhotos = await GetCachedServerPhotos();
    if (!serverPhotos) {
      return;
    }

    dispatch(setPhotosServer(serverPhotos));
  }, [dispatch]);

  return { LoadCachedServerPhotos };
}

function ServerPhotosCacheFolderPath() {
  return RNFS.ExternalCachesDirectoryPath + '/' + CACHE_FOLDER_NAME;
}

async function CheckCacheFolderExists() {
  const exists = await RNFS.exists(ServerPhotosCacheFolderPath());
  if (!exists) {
    await RNFS.mkdir(ServerPhotosCacheFolderPath());
  }
}

async function GetCachedServerPhotos(): Promise<PhotoServerType[] | null> {
  await CheckCacheFolderExists();
  const exists = await RNFS.exists(ServerPhotosCacheFolderPath() + '/' + CACHE_FILE_NAME);

  if (!exists) {
    return null;
  }

  const cachedContent = await RNFS.readFile(
    ServerPhotosCacheFolderPath() + '/' + CACHE_FILE_NAME,
  );
  if (!cachedContent) {
    return null;
  }

  return JSON.parse(cachedContent) as PhotoServerType[];
}

export async function CacheServerPhotos(photos: PhotoServerType[]) {
  await CheckCacheFolderExists();

  await RNFS.writeFile(
    ServerPhotosCacheFolderPath() + '/' + CACHE_FILE_NAME,
    JSON.stringify(photos),
  );
}
