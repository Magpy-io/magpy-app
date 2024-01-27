import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableHighlight } from 'react-native';

import { Icon } from '@rneui/themed';

import { colorsOld as colors } from '~/styles/colors';

type PropsType = {
  style?: ViewStyle;
  onPress?: () => void;
};

export default function CancelButton(props: PropsType) {
  return (
    <View>
      <TouchableHighlight
        style={[styles.backButtonStyle, props.style]}
        onPress={props.onPress}
        underlayColor={colors.underlayColor}>
        <Icon name="close" color={'black'} size={26} style={styles.backIconStyle} />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonStyle: { padding: 5 },
  backIconStyle: {},
});
