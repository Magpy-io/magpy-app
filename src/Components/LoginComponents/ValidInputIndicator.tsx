import React, { StyleSheet, View } from 'react-native';

import { Icon } from 'react-native-elements';

import { useTheme } from '~/Context/ThemeContext';
import { spacing } from '~/Styles/spacing';

export default function ValidInputIndicator() {
  const { colors } = useTheme();
  return (
    <View style={styles.viewStyle}>
      <Icon name="check-circle" size={16} color={colors.ERROR} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    position: 'absolute',
    left: spacing.spacing_l,
    top: 0,
    bottom: 0,
  },
});
