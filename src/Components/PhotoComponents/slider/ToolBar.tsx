import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, ViewStyle } from 'react-native';

import { Icon } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appColors } from '~/styles/colors';

type ToolBarProps = {
  inDevice: boolean;
  inServer: boolean;
  style?: ViewStyle;
  onDeleteLocal?: () => void;
  onAddLocal?: () => void;
  onDeleteServer?: () => void;
  onAddServer?: () => void;
  onShare?: () => void;
  onDetails?: () => void;
};

function ToolBar(props: ToolBarProps) {
  // Using insets here instead of SafeAreaView makes the toolBar not slide which I prefer, but not necessary
  // Feel free to experiment
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.toolBarView, props.style, { paddingBottom: insets.bottom }]}>
      <View style={styles.toolsView}>
        {props.inDevice ? (
          <ToolComponent
            icon="mobile-off"
            type="material"
            text="Delete from device"
            onPress={() => props.onDeleteLocal?.()}
          />
        ) : (
          <ToolComponent
            icon="system-update"
            type="material"
            text="Save to device"
            onPress={() => props.onAddLocal?.()}
          />
        )}
        {props.inServer ? (
          <ToolComponent
            icon="delete"
            type="material"
            text="Delete from server"
            onPress={() => props.onDeleteServer?.()}
          />
        ) : (
          <ToolComponent
            icon="backup"
            type="material"
            text="Back up"
            onPress={() => props.onAddServer?.()}
          />
        )}
        <ToolComponent
          icon="share"
          type="material"
          text="Share"
          onPress={() => props.onShare?.()}
        />
        <ToolComponent
          icon="info"
          type="material"
          text="Details"
          onPress={() => props.onDetails?.()}
        />
      </View>
    </View>
  );
}

type ToolComponentProps = {
  icon: string;
  type: string;
  text?: string;
  onPress: () => void;
};

const ToolComponent = React.memo(function ToolComponent(props: ToolComponentProps) {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={styles.toolComponent}
      underlayColor={appColors.UNDERLAY}>
      <View style={styles.iconTextView}>
        <Icon
          name={props.icon}
          type={props.type}
          color={TOOL_COLOR}
          size={ICON_SIZE}
          containerStyle={styles.iconContainerStyle}
        />
        {props.text ? <Text style={styles.textStyle}>{props.text}</Text> : null}
      </View>
    </TouchableHighlight>
  );
});

const ICON_SIZE = 22;
const TEXT_SIZE = 10;
const TOOLBAR_COLOR = appColors.BACKGROUND;
const TOOL_COLOR = appColors.TEXT;

const styles = StyleSheet.create({
  textStyle: {
    color: TOOL_COLOR,
    maxWidth: '70%',
    fontSize: TEXT_SIZE,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 4,
  },
  iconTextView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolComponent: {
    flex: 1,
  },
  toolBarView: {
    width: '100%',
    position: 'absolute',
    backgroundColor: TOOLBAR_COLOR,
    bottom: 0,
  },
  toolsView: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainerStyle: {},
});

export default React.memo(ToolBar);
