import { useEffect } from 'react';

import { useMainContext } from '~/Components/ContextProvider';
import PhotoGallery from '~/Components/PhotoGallery';

function photosNbToString(n: number) {
  if (!n) {
    return 'No backed up photos';
  }
  if (n == 1) {
    return '1 Photo in server';
  }
  return `${n} Photos in server`;
}

type PropsType = {};

export default function PhotoGalleryScreen(props: PropsType) {
  console.log('render screen server');
  const context = useMainContext();

  return (
    <PhotoGallery
      photos={context.photosServer}
      key={'gallery_server'}
      contextLocation={'server'}
      gridHeaderTextFunction={photosNbToString}
    />
  );
}
