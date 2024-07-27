import React from 'react';
import { StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';

import { Icon } from '@rneui/themed';

import { useTheme } from '~/Context/Contexts/ThemeContext';

type PropsType = {
  style?: ViewStyle;
  onPress?: () => void;
};

export default function SelectAllButton(props: PropsType) {
  const { colors } = useTheme();

  return (
    <View>
      <TouchableHighlight
        style={[styles.backButtonStyle, props.style]}
        onPress={props.onPress}
        underlayColor={colors.UNDERLAY}>
        <Icon name="select-all" color={colors.TEXT} size={26} style={styles.backIconStyle} />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonStyle: { padding: 5 },
  backIconStyle: {},
});
