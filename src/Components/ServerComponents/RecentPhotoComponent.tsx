import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/Photos/PhotosFunctions';
import {
  photoLocalSelector,
  photoServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { borderRadius } from '~/Styles/spacing';

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

  const { AddPhotoThumbnailIfMissing } = usePhotosFunctionsStore();

  useEffect(() => {
    if (serverPhoto && !localPhoto && !serverPhoto.uriThumbnail) {
      AddPhotoThumbnailIfMissing(serverPhoto).catch(console.log);
    }
  }, [AddPhotoThumbnailIfMissing, localPhoto, serverPhoto]);

  let uriSource = '';

  if (localPhoto) {
    uriSource = localPhoto.uri;
  } else if (serverPhoto?.uriThumbnail) {
    uriSource = serverPhoto.uriThumbnail;
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
