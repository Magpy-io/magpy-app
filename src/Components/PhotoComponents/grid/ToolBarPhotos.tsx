import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PhotoGalleryType, PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/PhotosFunctions';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { appColors } from '~/styles/colors';

import ToolComponent from '../common/ToolComponent';

const TOOLBAR_COLOR = appColors.BACKGROUND;

type ToolBarProps = {
  selectedKeys: IterableIterator<PhotoGalleryType>;
};

function ToolBarPhotos(props: ToolBarProps) {
  const insets = useSafeAreaInsets();

  const localPhotos = useAppSelector(state => state.photos.photosLocal);

  const { UploadPhotos } = usePhotosFunctionsStore();

  const selectedPhotos: PhotoLocalType[] = [];

  for (const photo of props.selectedKeys) {
    if (photo.serverId) {
      continue;
    }
    const localPhoto = photo.mediaId ? localPhotos[photo.mediaId] : undefined;
    if (localPhoto) {
      selectedPhotos.push(localPhoto);
    }
  }

  return (
    <View style={[styles.toolBarView, { paddingBottom: insets.bottom }]}>
      <View style={styles.toolsView}>
        <ToolComponent
          icon="backup"
          type="material"
          text="Back up"
          onPress={() => {
            UploadPhotos(selectedPhotos).catch(console.log);
          }}
        />

        <ToolComponent
          icon="backup"
          type="material"
          text="Back up"
          onPress={() => props.onAddServer?.()}
        />

        <ToolComponent
          icon="backup"
          type="material"
          text="Back up"
          onPress={() => props.onAddServer?.()}
        />

        <ToolComponent
          icon="mobile-off"
          type="material"
          text="Delete from device"
          onPress={() => props.onDeleteLocal?.()}
        />

        <ToolComponent
          icon="delete"
          type="material"
          text="Delete from server"
          onPress={() => props.onDeleteServer?.()}
        />

        <ToolComponent
          icon="share"
          type="material"
          text="Share"
          onPress={() => props.onShare?.()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolBarView: {
    width: '100%',
    position: 'absolute',
    backgroundColor: TOOLBAR_COLOR,
    bottom: 0,
  },
  toolsView: {
    height: 80,
    flexDirection: 'row',
  },
  iconContainerStyle: {},
});

export default React.memo(ToolBarPhotos);
