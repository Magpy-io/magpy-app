import { useEffect } from 'react';

import { GalleryGetPhotos } from '~/Helpers/GetGalleryPhotos';

import { useAppDispatch } from '../Store';
import { PhotoLocalType, setPhotosLocal } from './Photos';

export function usePhotosFunctionsStore() {
  const dispatch = useAppDispatch();

  const RefreshLocalPhotos = async () => {
    const photosFromDevice = await GalleryGetPhotos(3000);

    const photos: PhotoLocalType[] = photosFromDevice.edges.map(edge => {
      return {
        id: edge.node.id,
        uri: edge.node.image.uri,
        fileSize: edge.node.image.fileSize ?? 0,
        fileName: edge.node.image.filename ?? '',
        height: edge.node.image.height,
        width: edge.node.image.width,
        group_name: edge.node.group_name,
        created: new Date(edge.node.timestamp * 1000).toISOString(),
        modified: new Date(edge.node.modificationTimestamp * 1000).toISOString(),
        type: edge.node.type,
      };
    });

    dispatch(setPhotosLocal(photos));
  };

  return { RefreshLocalPhotos };
}

export function usePhotosStoreEffect() {
  const { RefreshLocalPhotos } = usePhotosFunctionsStore();

  useEffect(() => {
    RefreshLocalPhotos().catch(console.log);
  }, [RefreshLocalPhotos]);
}
