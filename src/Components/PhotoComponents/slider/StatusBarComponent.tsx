import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackButton from '~/Components/CommonComponents/BackButton';
import { appColors } from '~/styles/colors';

type StatusBarComponentProps = {
  inDevice: boolean;
  inServer: boolean;
  isLoading: boolean;
  loadingPercentage: number;
  style?: ViewStyle;
  onBackButton?: () => void;
};

function StatusBarComponent(props: StatusBarComponentProps) {
  const deviceStatusText = props.inDevice ? 'On device' : 'Not on device';
  const serverStatusText = props.inServer ? 'Backed up' : 'Not backed up';

  const deviceStatusIcon = props.inDevice ? 'mobile-friendly' : 'phonelink-erase';
  const serverStatusIcon = props.inServer ? 'cloud-done-outline' : 'cloud-offline-outline';

  return (
    <SafeAreaView edges={['top']} style={[styles.StatusBarStyle, props.style]}>
      <View style={styles.statusBarBackButtonStyle}>
        <BackButton onPress={props.onBackButton} />
      </View>
      <View style={styles.statusBarComponentStyle}>
        <StatusComponent
          icon={serverStatusIcon}
          type="ionicon"
          text={serverStatusText}
          valid={props.inServer}
        />
        <StatusComponent
          icon={deviceStatusIcon}
          text={deviceStatusText}
          valid={props.inDevice}
        />
      </View>
    </SafeAreaView>
  );
}

type StatusComponentProps = {
  icon: string;
  text: string;
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
  StatusBarStyle: {
    width: '100%',
    backgroundColor: appColors.BACKGROUND,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  statusBarBackButtonStyle: {},
  statusBarComponentStyle: {
    flexDirection: 'row',
    gap: 20,
    padding: 20,
  },
  statusComponentStyle: {},
});

export default React.memo(StatusBarComponent);
