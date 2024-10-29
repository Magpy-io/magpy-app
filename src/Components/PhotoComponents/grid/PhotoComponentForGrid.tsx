import React, { useCallback } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import {
  photoLocalSelector,
  photoServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';

import { useServerPhotoUri } from '../hooks/useServerPhotoUri';
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
  const { colors } = useTheme();

  const localPhoto = useAppSelector(photoLocalSelector(photo.mediaId));
  const serverPhoto = useAppSelector(photoServerSelector(photo.serverId));

  const uriThumbnail = useServerPhotoUri(serverPhoto, !localPhoto, 'thumbnail');

  const onPressPhoto = useCallback(() => onPress(photo), [onPress, photo]);
  const onLongPressPhoto = useCallback(() => onLongPress(photo), [onLongPress, photo]);

  let uriSource = '';

  if (localPhoto) {
    uriSource = localPhoto.uri;
  } else if (uriThumbnail) {
    uriSource = uriThumbnail;
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
