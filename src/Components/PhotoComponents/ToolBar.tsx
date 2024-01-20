import React from 'react';
import { PixelRatio, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { Icon } from '@rneui/themed';

import * as BarHeights from '~/Helpers/BarHeights';
import colors from '~/colors';

const ICON_SIZE = 20;
const TEXT_SIZE = 10;
const TOOLBAR_COLOR = '#ffffff';
const TOOL_COLOR = '#4d4d4d';

type ToolBarProps = {
  inDevice: boolean;
  inServer: boolean;
  style?: any;
  onDeleteLocal?: () => void;
  onAddLocal?: () => void;
  onDeleteServer?: () => void;
  onAddServer?: () => void;
  onShare?: () => void;
  onDetails?: () => void;
};

function ToolBar(props: ToolBarProps) {
  return (
    <View style={[styles.toolBarView, props.style]}>
      <View style={styles.toolsView}>
        {props.inDevice ? (
          <ToolComponent
            icon="mobile-off"
            text="Delete from device"
            onPress={() => props.onDeleteLocal?.()}
          />
        ) : (
          <ToolComponent
            icon="system-update"
            text="Save to device"
            onPress={() => props.onAddLocal?.()}
          />
        )}
        {props.inServer ? (
          <ToolComponent
            icon="delete"
            text="Delete from server"
            onPress={() => props.onDeleteServer?.()}
          />
        ) : (
          <ToolComponent icon="backup" text="Back up" onPress={() => props.onAddServer?.()} />
        )}
        <ToolComponent icon="share" text="Share" onPress={() => props.onShare?.()} />
        <ToolComponent icon="info" text="Details" onPress={() => props.onDetails?.()} />
      </View>
    </View>
  );
}

type ToolComponentProps = {
  icon: string;
  text?: string;
  textSize?: number;
  onPress: () => void;
};

const ToolComponent = React.memo((props: ToolComponentProps) => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={{
        flex: 1,
        padding: 5,
        paddingVertical: 8,
      }}
      underlayColor={colors.underlayColor}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          // justifyContent: "center",
        }}>
        <Icon
          name={props.icon}
          color={TOOL_COLOR}
          size={ICON_SIZE}
          containerStyle={styles.iconContainerStyle}
        />
        {props.text ? (
          <Text
            style={{
              color: TOOL_COLOR,
              paddingTop: 2,
              maxWidth: 70,
              fontSize: props.textSize ?? TEXT_SIZE,
              fontWeight: '700',
              textAlign: 'center',
            }}>
            {props.text}
          </Text>
        ) : null}
      </View>
    </TouchableHighlight>
  );
});

const styles = StyleSheet.create({
  toolBarView: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    marginBottom: BarHeights.GetNavigatorBarHeight(),
  },
  toolsView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: TOOLBAR_COLOR,
  },
  iconContainerStyle: {},
});

export default React.memo(ToolBar);
