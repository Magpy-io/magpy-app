import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { Icon } from '@rneui/themed';

import { appColors } from '~/styles/colors';
import { typography } from '~/styles/typography';

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
const TOOL_COLOR = appColors.TEXT;

const styles = StyleSheet.create({
  textStyle: {
    color: TOOL_COLOR,
    maxWidth: '70%',
    textAlign: 'center',
    paddingTop: 4,
    ...typography.smallText,
  },
  iconTextView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolComponent: {
    flex: 1,
  },
  iconContainerStyle: {},
});

export default ToolComponent;
