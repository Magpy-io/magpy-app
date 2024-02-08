import React, { useCallback, useEffect } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/PhotosFunctions';
import {
  photoLocalSelector,
  photoServerSelector,
} from '~/Context/ReduxStore/Slices/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { appColors } from '~/Styles/colors';

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

  const localPhoto = useAppSelector(photoLocalSelector(photo.mediaId));
  const serverPhoto = useAppSelector(photoServerSelector(photo.serverId));

  const { AddPhotoThumbnailIfMissing } = usePhotosFunctionsStore();

  useEffect(() => {
    if (serverPhoto && !localPhoto && !serverPhoto.uriThumbnail) {
      AddPhotoThumbnailIfMissing(serverPhoto).catch(console.log);
    }
  }, [AddPhotoThumbnailIfMissing, localPhoto, serverPhoto]);

  const onPressPhoto = useCallback(() => onPress(photo), [onPress, photo]);
  const onLongPressPhoto = useCallback(() => onLongPress(photo), [onLongPress, photo]);

  let uriSource = '';

  if (localPhoto) {
    uriSource = localPhoto.uri;
  } else if (serverPhoto?.uriThumbnail) {
    uriSource = serverPhoto.uriThumbnail;
  }

  return (
    <TouchableHighlight
      underlayColor={appColors.UNDERLAY}
      onPress={onPressPhoto}
      onLongPress={onLongPressPhoto}
      delayLongPress={100}>
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
