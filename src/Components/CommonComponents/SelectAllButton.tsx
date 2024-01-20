import { StyleSheet, View } from 'react-native';
import { TouchableHighlight } from 'react-native';

import { Icon } from '@rneui/themed';

import colors from '~/colors';

type PropsType = {
  style?: any;
  onPress?: () => void;
};

export default function SelectAllButton(props: PropsType) {
  return (
    <View>
      <TouchableHighlight
        style={[styles.backButtonStyle, props.style]}
        onPress={props.onPress}
        underlayColor={colors.underlayColor}>
        <Icon name="select-all" color={'black'} size={26} style={styles.backIconStyle} />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonStyle: { padding: 5 },
  backIconStyle: {},
});
