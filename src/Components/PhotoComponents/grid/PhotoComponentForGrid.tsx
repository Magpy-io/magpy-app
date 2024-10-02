import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import {
  photoLocalSelector,
  photoServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import {
  addPhotoThumbnailToCache,
  photoThumbnailExistsInCache,
} from '~/Helpers/GalleryFunctions/Functions';
import { GetPhotosById } from '~/Helpers/ServerQueries';

import ImageForGrid from './ImageForGrid';
import SelectionIconForGrid from './SelectionIconForGrid';

type PropsType = {
  photo: PhotoGalleryType;
  isSelecting: boolean;
  isSelected: boolean;
  onPress: (item: PhotoGalleryType) => void;
  onLongPress: (item: PhotoGalleryType) => void;
};

function PhotoComponentForGrid(props: PropsType) {
  const { photo, isSelecting, isSelected, onPress, onLongPress } = props;
  //console.log('Render photo for grid');
  const { colors } = useTheme();

  const localPhoto = useAppSelector(photoLocalSelector(photo.mediaId));
  const serverPhoto = useAppSelector(photoServerSelector(photo.serverId));

  const [photoThumbnailCacheStatus, setPhotoThumbnailCacheStatus] = useState<{
    exists: boolean;
    uri: string;
  } | null>(null);

  useEffect(() => {
    async function innerAsync() {
      if (serverPhoto) {
        const photoThumbnailStatus = await photoThumbnailExistsInCache(serverPhoto?.id);
        setPhotoThumbnailCacheStatus(photoThumbnailStatus);
      }
    }

    innerAsync().catch(console.log);
  }, [serverPhoto]);

  useEffect(() => {
    async function innerAsync() {
      if (serverPhoto && !localPhoto && photoThumbnailCacheStatus?.exists === false) {
        const res = await GetPhotosById.Post({
          ids: [serverPhoto.id],
          photoType: 'thumbnail',
        });

        if (!res.ok || !res.data.photos[0].exists) {
          throw new Error('Could not get photo by id');
        }

        const uri = await addPhotoThumbnailToCache(
          serverPhoto.id,
          res.data.photos[0].photo.image64,
        );

        setPhotoThumbnailCacheStatus({ exists: true, uri });
      }
    }

    innerAsync().catch(console.log);
  }, [localPhoto, photoThumbnailCacheStatus, serverPhoto]);

  const onPressPhoto = useCallback(() => onPress(photo), [onPress, photo]);
  const onLongPressPhoto = useCallback(() => onLongPress(photo), [onLongPress, photo]);

  let uriSource = '';

  if (localPhoto) {
    uriSource = localPhoto.uri;
  } else if (photoThumbnailCacheStatus?.exists) {
    uriSource = photoThumbnailCacheStatus.uri;
  }

  return (
    <TouchableHighlight
      underlayColor={colors.UNDERLAY}
      onPress={onPressPhoto}
      onLongPress={onLongPressPhoto}
      delayLongPress={300}>
      <View style={styles.itemStyle}>
        <ImageForGrid uri={uriSource} />
        {isSelecting && <SelectionIconForGrid isSelected={isSelected} />}
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    aspectRatio: 1,
  },
});

export default React.memo(PhotoComponentForGrid);
