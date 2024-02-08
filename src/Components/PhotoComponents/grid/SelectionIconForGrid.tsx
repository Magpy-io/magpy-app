import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from 'react-native-elements';

import { appColors } from '~/Styles/colors';

function SelectionIconForGrid({ isSelected }: { isSelected: boolean }) {
  return (
    <View style={styles.iconViewStyle}>
      {isSelected ? (
        <Icon style={styles.iconStyle} name="check-circle" size={35} color={SELECT_COLOR} />
      ) : (
        <Icon style={styles.iconStyle} name="radio-button-unchecked" size={35} color="white" />
      )}
    </View>
  );
}

const SELECT_COLOR = appColors.BACKGROUND;

const styles = StyleSheet.create({
  iconViewStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    position: 'absolute',
  },
  iconStyle: { margin: 5 },
});

export default React.memo(SelectionIconForGrid);
