import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from 'react-native-elements';

import { useTheme } from '~/Context/ThemeContext';

function SelectionIconForGrid({ isSelected }: { isSelected: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.iconViewStyle}>
      {isSelected ? (
        <Icon
          style={styles.iconStyle}
          name="check-circle"
          size={SELECT_SIZE}
          color={colors.SELECT_PHOTO}
        />
      ) : (
        <Icon
          style={styles.iconStyle}
          name="radio-button-unchecked"
          size={SELECT_SIZE}
          color={colors.SELECT_PHOTO}
        />
      )}
    </View>
  );
}

const SELECT_SIZE = 28;

const styles = StyleSheet.create({
  iconViewStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iconStyle: { margin: 5 },
});

export default React.memo(SelectionIconForGrid);
