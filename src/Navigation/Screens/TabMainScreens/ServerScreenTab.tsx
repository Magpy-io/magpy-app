import React from 'react';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import { serverGalleryPhotosSelector } from '~/Context/ReduxStore/Slices/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';

export default function ServerScreenTab() {
  console.log('render screen server');
  const photosGalleryServer = useAppSelector(serverGalleryPhotosSelector);
  const photosLocal = useAppSelector(state => state.photos.photosLocal);
  const photosServer = useAppSelector(state => state.photos.photosServer);

  return (
    <PhotoGallery
      key={'ServerPhotos'}
      photos={photosGalleryServer}
      serverPhotos={photosServer}
      localPhotos={photosLocal}
      title="Server photos"
    />
  );
}
