import { PixelRatio, StyleSheet, View } from 'react-native';
import { TouchableHighlight } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';

import * as BarHeights from '~/Helpers/BarHeights';
import colors from '~/colors';

type PropsType = {
  style?: any;
  onPress?: () => void;
};

export default function BackButton(props: PropsType) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        marginTop: BarHeights.GetStatusBarHeight(),
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
