import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableHighlight } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';

import * as BarHeights from '~/Helpers/BarHeights';
import { colorsOld as colors } from '~/styles/colors';

type PropsType = {
  style?: ViewStyle;
  onPress?: () => void;
};

export default function BackButton(props: PropsType) {
  const [barHeight, setBarHeight] = useState(0);

  useEffect(() => {
    async function getBarHeight() {
      setBarHeight(await BarHeights.GetStatusBarHeight());
    }

    getBarHeight().catch(console.log);
  });

  const navigation = useNavigation();
  return (
    <View
      style={{
        marginTop: barHeight,
      }}>
      <TouchableHighlight
        style={[styles.backButtonStyle, props.style]}
        onPress={() => {
          if (props.onPress) {
            props.onPress();
          } else {
            navigation.goBack();
          }
        }}
        underlayColor={colors.underlayColor}>
        <Icon name="arrow-back" color={'black'} size={26} style={styles.backIconStyle} />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonStyle: { padding: 5 },
  backIconStyle: {},
});
