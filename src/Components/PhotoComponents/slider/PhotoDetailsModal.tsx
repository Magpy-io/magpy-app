import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';

import BottomModal from '~/Components/CommonComponents/BottomModal';
import {
  CustomIconProps,
  ImageIcon,
  InDeviceIcon,
  InServerIcon,
  TimeIcon,
} from '~/Components/CommonComponents/Icons';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { formatDate } from '~/Helpers/Date';
import { getReadableFileSizeString } from '~/Helpers/FileSizeFormat';
import usePhotoData from '~/Hooks/usePhotoData';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { typography } from '~/Styles/typography';

type PhotoDetailsModalProps = {
  modalVisible: boolean;
  handleModal: () => void;
  photo: PhotoGalleryType;
};

export default function PhotoDetailsModal({
  modalVisible,
  handleModal,
  photo,
}: PhotoDetailsModalProps) {
  const photoData = usePhotoData(photo);

  const fileSizeString = photoData?.fileSize
    ? `(${getReadableFileSizeString(photoData.fileSize)})`
    : '';

  const filePath = photoData?.devicePath
    ? `${photoData.devicePath.split('://')?.[1]}`
    : undefined;

  const dateTaken = photoData?.created
    ? `Taken on ${formatDate(photoData.created)}`
    : 'Unknown date taken';

  return (
    <BottomModal modalVisible={modalVisible} handleModal={handleModal}>
      <>
        <PhotoInfo
          icon={ImageIcon}
          title={photoData?.fileName ?? ''}
          text={`${photoData?.width} x ${photoData?.height}`}
        />
        <PhotoInfo icon={TimeIcon} title={dateTaken} />
        {photoData.inServer && (
          <PhotoInfo
            icon={InServerIcon}
            title={`Backed up ${fileSizeString}`}
            text={`In server`}
          />
        )}
        {photoData.inDevice && (
          <PhotoInfo
            icon={InDeviceIcon}
            title={`On device ${fileSizeString}`}
            text={filePath}
          />
        )}
      </>
    </BottomModal>
  );
}

type PhotoInfoProps = {
  icon: (props: CustomIconProps) => JSX.Element;
  title?: string;
  text?: string;
};

function PhotoInfo({ icon: Icon, title, text }: PhotoInfoProps) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.view}>
      <Icon containerStyle={styles.iconContainer} />
      <View>
        {title && <Text style={styles.titleStyle}>{title}</Text>}
        {text && <Text style={styles.textStyle}>{text}</Text>}
      </View>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    iconContainer: {
      padding: 5,
      paddingRight: 30,
    },
    view: {
      flexDirection: 'row',
      padding: 5,
      paddingBottom: 30,
      marginRight: 20,
      alignItems: 'center',
    },
    textStyle: {
      ...typography(colors).mediumText,
    },
    titleStyle: {
      ...typography(colors).mediumText,
    },
  });
