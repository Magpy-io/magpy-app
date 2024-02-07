import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@rneui/themed';
import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackButton from '~/Components/CommonComponents/BackButton';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { appColors } from '~/Styles/colors';
import { typography } from '~/Styles/typography';

type StatusBarComponentProps = {
  photo: PhotoGalleryType;
  onBackButton?: () => void;
};

function StatusBarComponent({ photo, onBackButton }: StatusBarComponentProps) {
  const photoInDevice = !!photo.mediaId;
  const photoInServer = !!photo.serverId;
  const deviceStatusIcon = photoInDevice ? 'mobile-friendly' : 'phonelink-erase';
  const serverStatusIcon = photoInServer ? 'cloud-done-outline' : 'cloud-offline-outline';
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.StatusBarStyle, { paddingTop: insets.top }]}>
      <View style={styles.BackButtonTitleView}>
        <BackButton onPress={onBackButton} />
        <Text style={styles.title}>{'title'}</Text>
      </View>
      <View style={styles.statusBarComponentStyle}>
        <StatusComponent icon={serverStatusIcon} type="ionicon" valid={photoInServer} />
        <StatusComponent icon={deviceStatusIcon} valid={photoInDevice} />
      </View>
    </View>
  );
}

type StatusComponentProps = {
  icon: string;
  valid: boolean;
  type?: string;
};

const StatusComponent = React.memo(function StatusComponent(props: StatusComponentProps) {
  return (
    <View style={styles.statusComponentStyle}>
      <Icon
        name={props.icon}
        type={props.type ?? 'material'}
        containerStyle={{}}
        size={26}
        color={props.valid ? VALID_COLOR : INVALID_COLOR}
      />
    </View>
  );
});

const VALID_COLOR = appColors.PRIMARY;
const INVALID_COLOR = appColors.TEXT_LIGHT;

const styles = StyleSheet.create({
  title: {
    ...typography.largeTextBold,
  },
  StatusBarStyle: {
    width: '100%',
    backgroundColor: appColors.BACKGROUND,
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

export default React.memo(StatusBarComponent);
