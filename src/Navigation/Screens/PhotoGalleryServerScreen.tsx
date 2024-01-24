import React from 'react';

import PhotoGallery from '~/Components/PhotoGallery';
import { usePhotosContext } from '~/Context/UseContexts/usePhotosContext';

function photosNbToString(n: number) {
  if (!n) {
    return 'No backed up photos';
  }
  if (n == 1) {
    return '1 Photo in server';
  }
  return `${n} Photos in server`;
}

export default function PhotoGalleryScreen() {
  console.log('render screen server');
  const { photosState } = usePhotosContext();

  return (
    <PhotoGallery
      photos={photosState.photosServer}
      key={'gallery_server'}
      contextLocation={'server'}
      gridHeaderTextFunction={photosNbToString}
    />
  );
}
