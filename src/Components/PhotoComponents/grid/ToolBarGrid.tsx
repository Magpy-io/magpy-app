import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appColors } from '~/styles/colors';

import ToolComponent from '../common/ToolComponent';

const TOOLBAR_COLOR = appColors.BACKGROUND;

type ToolBarProps = {
  style?: ViewStyle;
  contextLocation: string;
  onDeleteLocal?: () => void;
  onAddLocal?: () => void;
  onDeleteServer?: () => void;
  onAddServer?: () => void;
  onShare?: () => void;
  onDetails?: () => void;
};

function ToolBarGrid(props: ToolBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.toolBarView, props.style, { paddingBottom: insets.bottom }]}>
      <View style={styles.toolsView}>
        {props.contextLocation == 'local' ? (
          <ToolComponent
            icon="backup"
            type="material"
            text="Back up"
            onPress={() => props.onAddServer?.()}
          />
        ) : (
          <ToolComponent
            icon="system-update"
            type="material"
            text="Save to device"
            onPress={() => props.onAddLocal?.()}
          />
        )}
        <ToolComponent
          icon="mobile-off"
          type="material"
          text="Delete from device"
          onPress={() => props.onDeleteLocal?.()}
        />
        {props.contextLocation == 'server' && (
          <ToolComponent
            icon="delete"
            type="material"
            text="Delete from server"
            onPress={() => props.onDeleteServer?.()}
          />
        )}
        <ToolComponent
          icon="share"
          type="material"
          text="Share"
          onPress={() => props.onShare?.()}
        />
      </View>
    </View>
  );
}

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
  },
  iconContainerStyle: {},
});

export default React.memo(ToolBarGrid);
