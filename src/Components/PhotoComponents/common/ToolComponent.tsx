import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { Icon } from '@rneui/themed';

import { useTheme } from '~/Context/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { typography } from '~/Styles/typography';

type ToolComponentProps = {
  icon: string;
  type: string;
  text?: string;
  onPress: () => void;
};

const ToolComponent = React.memo(function ToolComponent(props: ToolComponentProps) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={styles.toolComponent}
      underlayColor={colors.UNDERLAY}>
      <View style={styles.iconTextView}>
        <Icon
          name={props.icon}
          type={props.type}
          color={colors.TEXT}
          size={ICON_SIZE}
          containerStyle={styles.iconContainerStyle}
        />
        {props.text ? <Text style={styles.textStyle}>{props.text}</Text> : null}
      </View>
    </TouchableHighlight>
  );
});

const ICON_SIZE = 22;

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    textStyle: {
      color: colors.TEXT,
      maxWidth: '70%',
      textAlign: 'center',
      paddingTop: 4,
      ...typography(colors).smallText,
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
