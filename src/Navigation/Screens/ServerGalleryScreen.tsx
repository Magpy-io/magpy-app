import React from 'react';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import { PhotoGalleryContextProvider } from '~/Components/PhotoComponents/PhotoGalleryContext';

import { useMainStackNavigation } from '../Navigators/MainStackNavigator';

export default function ServerGalleryScreen() {
  const { goBack } = useMainStackNavigation();

  return (
    <PhotoGalleryContextProvider isServer>
      <PhotoGallery
        key={'ServerPhotos'}
        title="Server photos"
        showBackButton
        onPressBack={() => goBack()}
      />
    </PhotoGalleryContextProvider>
  );
}
