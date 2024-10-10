import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import {
  DeleteFromDeviceIcon,
  DeleteFromServerIcon,
  DeleteIcon,
  DownloadIcon,
  InfoIcon,
  UploadIcon,
} from '~/Components/CommonComponents/Icons';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';

import ToolComponent from '../common/ToolComponent';

type ToolBarPhotosComponentProps = {
  onBackUp: () => void;
  onDownload: () => void;
  onDeleteFromDevice: () => void;
  onDelete: () => void;
  onDeleteFromServer: () => void;
  onShare: () => void;
  onInfo: () => void;
  showInfo: boolean;

  nbPhotos: number;
  nbPhotosToBackUp: number;
  nbPhotosToDownload: number;
  nbPhotosToDeleteEverywhere: number;
  nbPhotosToDeleteFromServer: number;
  nbPhotosToDeleteFromDevice: number;
  isPhotoBeingUploaded: boolean;
  isPhotoBeingDownloaded: boolean;
};

function ToolBarPhotosComponent(props: ToolBarPhotosComponentProps) {
  const {
    nbPhotos,
    nbPhotosToBackUp,
    nbPhotosToDownload,
    nbPhotosToDeleteEverywhere,
    nbPhotosToDeleteFromServer,
    nbPhotosToDeleteFromDevice,
    isPhotoBeingUploaded,
    isPhotoBeingDownloaded,
    onBackUp,
    onDelete,
    onDeleteFromDevice,
    onDownload,
    onInfo,
    showInfo,
    onDeleteFromServer,
  } = props;

  const showNumber = nbPhotos > 1;
  const styles = useStyles(makeStyles);

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollviewContent}>
      {nbPhotosToBackUp > 0 && (
        <ToolComponent
          icon={UploadIcon}
          text={isPhotoBeingUploaded ? 'Backing up...' : 'Back up'}
          onPress={onBackUp}
          disabled={isPhotoBeingUploaded}
          showNumber={showNumber}
          number={nbPhotosToBackUp}
        />
      )}

      {nbPhotosToDownload > 0 && (
        <ToolComponent
          icon={DownloadIcon}
          text={isPhotoBeingDownloaded ? 'Downloading...' : 'Download'}
          onPress={onDownload}
          disabled={isPhotoBeingDownloaded}
          showNumber={showNumber}
          number={nbPhotosToDownload}
        />
      )}

      {nbPhotosToDeleteEverywhere > 0 && (
        <ToolComponent
          icon={DeleteIcon}
          text="Delete everywhere"
          onPress={onDelete}
          showNumber={showNumber}
          number={nbPhotosToDeleteEverywhere}
        />
      )}
      {nbPhotosToDeleteFromDevice > 0 && (
        <ToolComponent
          icon={DeleteFromDeviceIcon}
          text="Delete from device"
          onPress={onDeleteFromDevice}
          showNumber={showNumber}
          number={nbPhotosToDeleteFromDevice}
        />
      )}

      {nbPhotosToDeleteFromServer > 0 && (
        <ToolComponent
          icon={DeleteFromServerIcon}
          text="Delete from server"
          onPress={onDeleteFromServer}
          showNumber={showNumber}
          number={nbPhotosToDeleteFromServer}
        />
      )}

      {showInfo && onInfo && <ToolComponent icon={InfoIcon} text="Details" onPress={onInfo} />}
    </ScrollView>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    scrollviewContent: {},
    toolBarView: {
      width: '100%',
      position: 'absolute',
      backgroundColor: colors.BACKGROUND,
      bottom: 0,
    },
  });

export default React.memo(ToolBarPhotosComponent);
