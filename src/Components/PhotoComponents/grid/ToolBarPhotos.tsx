import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { usePhotosDownloadingFunctions } from '~/Context/ContextSlices/PhotosDownloadingContext/usePhotosDownloadingContext';
import { PhotoGalleryType, PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos';
import { usePhotosFunctionsStore } from '~/Context/ReduxStore/Slices/PhotosFunctions';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import ToolComponent from '../common/ToolComponent';
import PhotoDetailsModal from '../slider/PhotoDetailsModal';

type ToolBarProps = {
  selectedKeys: Set<string>;
};

function ToolBarPhotos(props: ToolBarProps) {
  const styles = useStyles(makeStyles);
  const [modalVisible, setModalVisible] = useState(false);
  const handleModal = () => setModalVisible(prev => !prev);
  const isOnePhoto = props.selectedKeys.size === 1;

  const localPhotos = useAppSelector(state => state.photos.photosLocal);
  const serverPhotos = useAppSelector(state => state.photos.photosServer);
  const galleryPhotos = useAppSelector(state => state.photos.photosGallery);

  const { UploadPhotos } = usePhotosFunctionsStore();

  const { DownloadPhotos } = usePhotosDownloadingFunctions();

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

  const selectedServerPhotosIds: string[] = [];

  for (const photo of seletedGalleryPhotos) {
    if (photo.mediaId) {
      continue;
    }
    const serverPhoto = photo.serverId ? serverPhotos[photo.serverId] : undefined;
    if (serverPhoto) {
      selectedServerPhotosIds.push(serverPhoto.id);
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
          onPress={() => DownloadPhotos(selectedServerPhotosIds)}
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

        {isOnePhoto && (
          <ToolComponent icon="info" type="material" text="Details" onPress={handleModal} />
        )}
      </View>
      {isOnePhoto && (
        <PhotoDetailsModal
          modalVisible={modalVisible}
          handleModal={handleModal}
          photo={galleryPhotos[0]}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    toolBarView: {
      width: '100%',
      position: 'absolute',
      backgroundColor: colors.BACKGROUND,
      bottom: 0,
    },
    toolsView: {
      height: 80,
      flexDirection: 'row',
    },
    iconContainerStyle: {},
  });

export default React.memo(ToolBarPhotos);
