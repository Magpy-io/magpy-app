import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { PhotoType } from '~/Helpers/types';

import ImageForGrid from './ImageForGrid';
import SelectionIconForGrid from './SelectionIconForGrid';

type PropsType = {
  photo: PhotoType;
  isSelecting: boolean;
  isSelected: boolean;
  onPress: (item: PhotoType) => void;
  onLongPress: (item: PhotoType) => void;
};

function PhotoComponentForGrid(props: PropsType) {
  const { photo, isSelecting, isSelected, onPress, onLongPress } = props;
  // console.log('Render PhotoComponentForGrid');

  const uriSource = useMemo(() => {
    if (photo.inDevice) {
      return photo.image.path;
    } else {
      if (photo.image.pathCache) {
        return photo.image.pathCache;
      } else {
        return photo.image.image64;
      }
    }
  }, [photo]);

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
