import React from 'react';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import { PhotoGalleryContextProvider } from '~/Components/PhotoComponents/PhotoGalleryContext';

import { useMainNavigation } from '../Navigation';

export default function ServerGalleryScreen() {
  console.log('render server gallery screen');
  const navigation = useMainNavigation();

  return (
    <PhotoGalleryContextProvider isServer>
      <PhotoGallery
        key={'ServerPhotos'}
        title="Server photos"
        showBackButton
        onPressBack={() => navigation.goBack()}
      />
    </PhotoGalleryContextProvider>
  );
}
