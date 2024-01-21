import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appColors } from '~/styles/colors';

import ToolComponent from '../common/ToolComponent';

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

const TOOLBAR_COLOR = appColors.BACKGROUND;

const styles = StyleSheet.create({
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
