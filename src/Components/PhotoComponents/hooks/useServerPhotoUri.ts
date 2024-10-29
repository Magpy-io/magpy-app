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
        const photoThumbnailUri = await photoExistsInCache(serverPhoto.id);
        if (photoThumbnailUri) {
          setServerPhotoUri(photoThumbnailUri);
        }
        setCacheChecked(true);
      }
    }

    innerAsync().catch(LOG.error);
  }, [serverPhoto, photoUriNeeded, photoExistsInCache]);

  useEffect(() => {
    async function innerAsync() {
      if (serverPhoto && photoUriNeeded && !serverPhotoUri && cacheChecked) {
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
