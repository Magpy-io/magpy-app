import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableHighlight } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';

import { appColors } from '~/Styles/colors';

type PropsType = {
  style?: ViewStyle;
  onPress?: () => void;
};

export default function BackButton(props: PropsType) {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableHighlight
        style={[styles.backButtonStyle, props.style]}
        onPress={() => {
          if (props.onPress) {
            props.onPress();
          } else {
            navigation.goBack();
          }
        }}
        underlayColor={appColors.UNDERLAY}>
        <Icon
          name="chevron-back"
          type="ionicon"
          color={appColors.TEXT}
          size={26}
          style={styles.backIconStyle}
        />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonStyle: { padding: 14 },
  backIconStyle: {},
});
