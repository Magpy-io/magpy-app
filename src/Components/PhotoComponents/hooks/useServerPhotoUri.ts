import { useEffect, useState } from 'react';

import { PhotoServerType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import {
  addPhotoCompressedToCache,
  addPhotoThumbnailToCache,
  photoCompressedExistsInCache,
  photoThumbnailExistsInCache,
} from '~/Helpers/GalleryFunctions/Functions';
import { LOG } from '~/Helpers/Logging/Logger';
import { useServerQueries } from '~/Hooks/useServerQueries';
import { useToast } from '~/Hooks/useToast';

const serverPhotosThumbnailUri = new Map<string, string>();
const serverPhotosCompressedUri = new Map<string, string>();

export function useServerPhotoUri(
  serverPhoto: PhotoServerType | undefined,
  photoUriNeeded: boolean,
  photoVariation: 'thumbnail' | 'compressed',
) {
  const [serverPhotoUri, setServerPhotoUri] = useState<string | null>(null);
  const [cacheChecked, setCacheChecked] = useState(false);

  const { photoExistsInCache, addPhotoToCache } = getFunctionsForVariation(photoVariation);

  const { GetPhotosByIdPost } = useServerQueries();

  const { showToastError } = useToast();

  useEffect(() => {
    async function innerAsync() {
      if (serverPhoto && photoUriNeeded) {
        if (photoVariation == 'thumbnail') {
          const serverPhotoUriCached = serverPhotosThumbnailUri.get(serverPhoto.id);

          if (serverPhotoUriCached) {
            setServerPhotoUri(serverPhotoUriCached);
            setCacheChecked(true);
            return;
          }
        }

        if (photoVariation == 'compressed') {
          console.log('Checking image from local Map', photoVariation, serverPhoto.id);
          const serverPhotoUriCached = serverPhotosCompressedUri.get(serverPhoto.id);

          if (serverPhotoUriCached) {
            setServerPhotoUri(serverPhotoUriCached);
            setCacheChecked(true);
            return;
          }
        }

        const photoUri = await photoExistsInCache(serverPhoto.id);
        if (photoUri) {
          console.log('Checking image from cache', photoVariation, serverPhoto.id);
          setServerPhotoUri(photoUri);

          if (photoVariation == 'thumbnail') {
            serverPhotosThumbnailUri.set(serverPhoto.id, photoUri);
          }

          if (photoVariation == 'compressed') {
            serverPhotosCompressedUri.set(serverPhoto.id, photoUri);
          }
        }
        setCacheChecked(true);
      }
    }

    innerAsync().catch(LOG.error);
  }, [serverPhoto, photoUriNeeded, photoExistsInCache, photoVariation]);

  useEffect(() => {
    async function innerAsync() {
      if (serverPhoto && photoUriNeeded && !serverPhotoUri && cacheChecked) {
        console.log(photoVariation, serverPhoto.id);
        const res = await GetPhotosByIdPost({
          ids: [serverPhoto.id],
          photoType: photoVariation,
        });

        if (!res.ok) {
          throw new Error('Could not get photo by id, ' + JSON.stringify(res));
        }

        if (!res.data.photos[0].exists) {
          throw new Error('Could not find photo by id in server, ' + serverPhoto.id);
        }

        const uri = await addPhotoToCache(serverPhoto.id, res.data.photos[0].photo.image64);

        setServerPhotoUri(uri);
      }
    }

    innerAsync().catch(err => {
      showToastError('Error fetching photo from server.');
      LOG.error(err);
    });
  }, [
    photoUriNeeded,
    cacheChecked,
    serverPhotoUri,
    serverPhoto,
    photoVariation,
    addPhotoToCache,
    GetPhotosByIdPost,
    showToastError,
  ]);

  return serverPhotoUri;
}

function getFunctionsForVariation(photoVariation: 'thumbnail' | 'compressed') {
  if (photoVariation == 'thumbnail') {
    return {
      photoExistsInCache: photoThumbnailExistsInCache,
      addPhotoToCache: addPhotoThumbnailToCache,
    };
  } else if (photoVariation == 'compressed') {
    return {
      photoExistsInCache: photoCompressedExistsInCache,
      addPhotoToCache: addPhotoCompressedToCache,
    };
  } else {
    throw new Error('useServerPhotoUri: invalid photoVariation');
  }
}
