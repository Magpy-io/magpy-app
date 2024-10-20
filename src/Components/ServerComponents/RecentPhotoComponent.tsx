import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import {
  photoLocalSelector,
  photoServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { borderRadius } from '~/Styles/spacing';

import { useServerPhotoUri } from '../PhotoComponents/hooks/useServerPhotoUri';

export default function RecentPhotoComponent({
  photo,
  size,
}: {
  photo: PhotoGalleryType;
  size?: number;
}) {
  const default_size = 150;
  const localPhoto = useAppSelector(photoLocalSelector(photo.mediaId));
  const serverPhoto = useAppSelector(photoServerSelector(photo.serverId));

  const uriThumbnail = useServerPhotoUri(serverPhoto, !localPhoto, 'thumbnail');

  let uriSource = '';

  if (localPhoto) {
    uriSource = localPhoto.uri;
  } else if (uriThumbnail) {
    uriSource = uriThumbnail;
  }
  return uriSource ? (
    <Image
      source={{ uri: uriSource }}
      resizeMode="cover"
      width={size ?? default_size}
      height={size ?? default_size}
      style={styles.imageStyle}
    />
  ) : (
    <View style={styles.imageStyle} />
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: borderRadius.default,
  },
});
