import React from 'react';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';

export default function PhotoGalleryScreenTab() {
  console.log('render screen server');

  return <PhotoGallery key={'gallery_server'} />;
}
