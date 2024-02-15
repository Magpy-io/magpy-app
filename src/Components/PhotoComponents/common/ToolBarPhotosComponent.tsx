import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import {
  DeleteFromDeviceIcon,
  DeleteFromServerIcon,
  DeleteIcon,
  DownloadIcon,
  InfoIcon,
  ShareIcon,
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
};

export default function ToolBarPhotosComponent({
  onBackUp,
  onDelete,
  onDeleteFromDevice,
  onDownload,
  onInfo,
  onShare,
  showInfo,
  onDeleteFromServer,
}: ToolBarPhotosComponentProps) {
  const styles = useStyles(makeStyles);

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollviewContent}>
      <ToolComponent icon={UploadIcon} text="Back up" onPress={onBackUp} />

      <ToolComponent icon={DownloadIcon} text="Download" onPress={onDownload} />

      <ToolComponent
        icon={DeleteFromDeviceIcon}
        text="Delete from device"
        onPress={onDeleteFromDevice}
      />
      <ToolComponent icon={DeleteIcon} text="Delete everywhere" onPress={onDelete} />

      <ToolComponent
        icon={DeleteFromServerIcon}
        text="Delete from server"
        onPress={onDeleteFromServer}
      />

      <ToolComponent icon={ShareIcon} text="Share" onPress={onShare} />

      {showInfo && <ToolComponent icon={InfoIcon} text="Details" onPress={onInfo} />}
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
