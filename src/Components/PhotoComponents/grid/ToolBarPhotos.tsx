import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PhotoGalleryType, PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/PhotosFunctions';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { appColors } from '~/Styles/colors';

import ToolComponent from '../common/ToolComponent';

const TOOLBAR_COLOR = appColors.BACKGROUND;

type ToolBarProps = {
  selectedKeys: Set<string>;
};

function ToolBarPhotos(props: ToolBarProps) {
  const localPhotos = useAppSelector(state => state.photos.photosLocal);
  const galleryPhotos = useAppSelector(state => state.photos.photosGallery);

  const { UploadPhotos } = usePhotosFunctionsStore();

  const seletedGalleryPhotos: PhotoGalleryType[] = [];

  for (const galleryPhoto of galleryPhotos) {
    if (props.selectedKeys.has(galleryPhoto.key)) {
      seletedGalleryPhotos.push(galleryPhoto);
    }
  }

  const selectedLocalPhotos: PhotoLocalType[] = [];

  for (const photo of seletedGalleryPhotos) {
    if (photo.serverId) {
      continue;
    }
    const localPhoto = photo.mediaId ? localPhotos[photo.mediaId] : undefined;
    if (localPhoto) {
      selectedLocalPhotos.push(localPhoto);
    }
  }

  return (
    <View style={[styles.toolBarView]}>
      <View style={styles.toolsView}>
        <ToolComponent
          icon="backup"
          type="material"
          text="Back up"
          onPress={() => {
            UploadPhotos(selectedLocalPhotos).catch(console.log);
          }}
        />

        <ToolComponent
          icon="file-download"
          type="material"
          text="Download"
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
