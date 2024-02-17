import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackButton from '~/Components/CommonComponents/BackButton';
import {
  CustomIconProps,
  InDeviceIcon,
  InServerIcon,
  NotInDeviceIcon,
  NotInServerIcon,
} from '~/Components/CommonComponents/Icons';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useTheme } from '~/Context/ThemeContext';
import { formatDate } from '~/Helpers/Date';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { typography } from '~/Styles/typography';

type StatusBarComponentProps = {
  photo: PhotoGalleryType;
  onBackButton?: () => void;
};

function PhotoSliderHeader({ photo, onBackButton }: StatusBarComponentProps) {
  const styles = useStyles(makeStyles);

  const photoInDevice = !!photo.mediaId;
  const photoInServer = !!photo.serverId;
  const insets = useSafeAreaInsets();
  const title = formatDate(photo.date);
  return (
    <View style={[styles.StatusBarStyle, { paddingTop: insets.top }]}>
      <View style={styles.BackButtonTitleView}>
        <BackButton onPress={onBackButton} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.statusBarComponentStyle}>
        <StatusComponent
          iconValid={InServerIcon}
          iconInvalid={NotInServerIcon}
          valid={photoInServer}
        />
        <StatusComponent
          iconValid={InDeviceIcon}
          iconInvalid={NotInDeviceIcon}
          valid={photoInDevice}
        />
      </View>
    </View>
  );
}

type StatusComponentProps = {
  iconValid: (props: CustomIconProps) => JSX.Element;
  iconInvalid: (props: CustomIconProps) => JSX.Element;
  valid: boolean;
};

const StatusComponent = React.memo(function StatusComponent({
  iconValid: IconValid,
  iconInvalid: IconInvalid,
  valid,
}: StatusComponentProps) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.statusComponentStyle}>
      {valid ? <IconValid color={colors.SECONDARY} /> : <IconInvalid color={colors.TEXT} />}
    </View>
  );
});

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    title: {
      ...typography(colors).largeTextBold,
    },
    StatusBarStyle: {
      width: '100%',
      backgroundColor: colors.BACKGROUND,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
    },
    BackButtonTitleView: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    statusBarComponentStyle: {
      flexDirection: 'row',
      gap: 20,
      padding: 20,
    },
    statusComponentStyle: {},
  });

export default React.memo(PhotoSliderHeader);
