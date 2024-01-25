import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { PhotoGalleryType, photoLocalSelector } from '~/Context/ReduxStore/Slices/Photos';
import { useAppSelector } from '~/Context/ReduxStore/Store';

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
  console.log('Render photo for grid');

  const localPhoto = useAppSelector(photoLocalSelector(photo.mediaId));

  // const uriSource = useMemo(() => {
  //   if (photo.inDevice) {
  //     return photo.image.path;
  //   } else {
  //     if (photo.image.pathCache) {
  //       return photo.image.pathCache;
  //     } else {
  //       return photo.image.image64;
  //     }
  //   }
  // }, [photo]);
  const uriSource = localPhoto?.uri;

  const onPressPhoto = useCallback(() => onPress(photo), [onPress, photo]);
  const onLongPressPhoto = useCallback(() => onLongPress(photo), [onLongPress, photo]);

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={onPressPhoto}
      onLongPress={onLongPressPhoto}>
      <View style={styles.itemStyle}>
        <ImageForGrid uri={uriSource} />
        {isSelecting && <SelectionIconForGrid isSelected={isSelected} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    padding: 1,
    aspectRatio: 1,
    flex: 1,
  },
});

export default React.memo(PhotoComponentForGrid);
