import React from 'react';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import {
  photosLocalSelector,
  photosServerSelector,
  serverGalleryPhotosSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';

import { useMainNavigation } from '../Navigation';

export default function ServerGalleryScreen() {
  console.log('render server gallery screen');
  const photosGalleryServer = useAppSelector(serverGalleryPhotosSelector);
  const photosLocal = useAppSelector(photosLocalSelector);
  const photosServer = useAppSelector(photosServerSelector);
  const navigation = useMainNavigation();

  return (
    <PhotoGallery
      key={'ServerPhotos'}
      photos={photosGalleryServer}
      serverPhotos={photosServer}
      localPhotos={photosLocal}
      title="Server photos"
      showBackButton
      onPressBack={() => navigation.goBack()}
    />
  );
}
