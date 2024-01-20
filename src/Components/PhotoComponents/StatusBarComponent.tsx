import React from 'react';
import { PixelRatio, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@rneui/themed';
import * as Progress from 'react-native-progress';

import BackButton from '~/Components/CommonComponents/BackButton';
import * as BarHeights from '~/Helpers/BarHeights';
import colors from '~/colors';

type StatusBarComponentProps = {
  inDevice: boolean;
  inServer: boolean;
  isLoading: boolean;
  loadingPercentage: number;
  style?: any;
  onBackButton?: () => void;
};

function StatusBarComponent(props: StatusBarComponentProps) {
  const deviceStatusText = props.inDevice ? 'On device' : 'Not on device';
  const serverStatusText = props.inServer ? 'Backed up' : 'Not backed up';

  const deviceStatusIcon = props.inDevice ? 'mobile-friendly' : 'phonelink-erase';
  const serverStatusIcon = props.inServer ? 'cloud-done' : 'cloud-off';

  return (
    <View style={[styles.StatusBarStyle, props.style]}>
      <View style={styles.statusBarBackButtonStyle}>
        <BackButton onPress={props.onBackButton} />
      </View>
      <View style={styles.statusBarComponentStyle}>
        {props.isLoading ? (
          <Progress.Pie
            style={styles.pieStyle}
            progress={props.loadingPercentage}
            size={30}
            borderColor={'#d6d6d6'}
            color={'#d6d6d6'}
          />
        ) : (
          <></>
        )}
        <StatusComponent
          icon={deviceStatusIcon}
          text={deviceStatusText}
          valid={props.inDevice}
        />
        <StatusComponent
          icon={serverStatusIcon}
          text={serverStatusText}
          valid={props.inServer}
        />
      </View>
    </View>
  );
}

type StatusComponentProps = {
  icon: string;
  text: string;
  valid: boolean;
};

const VALID_COLOR = colors.success;
const VALID_BACKGROUND_COLOR = colors.lightSuccess;
const INVALID_COLOR = 'black';
const INVALID_BACKGROUND_COLOR = colors.greyBackgroundColor;

const StatusComponent = React.memo((props: StatusComponentProps) => {
  return (
    <View
      style={[
        styles.statusComponentStyle,
        {
          marginTop: BarHeights.GetStatusBarHeight(),
          padding: 5,
          backgroundColor: props.valid ? VALID_BACKGROUND_COLOR : INVALID_BACKGROUND_COLOR,
        },
      ]}>
      <Icon
        name={props.icon}
        containerStyle={{}}
        size={15}
        color={props.valid ? VALID_COLOR : INVALID_COLOR}
      />
      <Text
        style={{
          fontWeight: 'bold',
          color: props.valid ? VALID_COLOR : INVALID_COLOR,
          fontSize: 15,
          marginLeft: 3,
        }}>
        {props.text}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  StatusBarStyle: {
    padding: 5,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  statusBarBackButtonStyle: {},
  statusBarComponentStyle: {
    flexDirection: 'row',
  },
  statusComponentStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
    marginHorizontal: 3,
  },
  pieStyle: { marginRight: 10 },
});

export default React.memo(StatusBarComponent);
