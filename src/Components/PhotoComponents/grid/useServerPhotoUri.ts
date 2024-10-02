import { useEffect, useState } from 'react';

import { PhotoServerType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import {
  addPhotoCompressedToCache,
  addPhotoThumbnailToCache,
  photoCompressedExistsInCache,
  photoThumbnailExistsInCache,
} from '~/Helpers/GalleryFunctions/Functions';
import { GetPhotosById } from '~/Helpers/ServerQueries';

export function useServerPhotoUri(
  serverPhoto: PhotoServerType | undefined,
  photoUriNeeded: boolean,
  photoVariation: 'thumbnail' | 'compressed',
) {
  const [serverPhotoUri, setServerPhotoUri] = useState<string | null>(null);
  const [cacheChecked, setCacheChecked] = useState(false);

  const { photoExistsInCache, addPhotoToCache } = getFunctionsForVariation(photoVariation);

  useEffect(() => {
    async function innerAsync() {
      if (serverPhoto && photoUriNeeded) {
        const photoThumbnailUri = await photoExistsInCache(serverPhoto.id);
        if (photoThumbnailUri) {
          setServerPhotoUri(photoThumbnailUri);
        }
        setCacheChecked(true);
      }
    }

    innerAsync().catch(console.log);
  }, [serverPhoto, photoUriNeeded, photoExistsInCache]);

  useEffect(() => {
    async function innerAsync() {
      if (serverPhoto && photoUriNeeded && !serverPhotoUri && cacheChecked) {
        const res = await GetPhotosById.Post({
          ids: [serverPhoto.id],
          photoType: photoVariation,
        });

        if (!res.ok || !res.data.photos[0].exists) {
          throw new Error('Could not get photo by id');
        }

        const uri = await addPhotoToCache(serverPhoto.id, res.data.photos[0].photo.image64);

        setServerPhotoUri(uri);
      }
    }

    innerAsync().catch(console.log);
  }, [
    photoUriNeeded,
    cacheChecked,
    serverPhotoUri,
    serverPhoto,
    photoVariation,
    addPhotoToCache,
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
