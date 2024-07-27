import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import CancelButton from '~/Components/CommonComponents/CancelButton';
import SelectAllButton from '~/Components/CommonComponents/SelectAllButton';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { typography } from '~/Styles/typography';

type SelectionBarProps = {
  selectedNb: number;
  style?: ViewStyle;
  onCancelButton?: () => void;
  onSelectAllButton?: () => void;
};

function selectedElementsToString(n: number) {
  if (!n) {
    return 'No Elements Selected';
  }

  if (n == 1) {
    return '1 Element Selected';
  }

  return `${n} Elements Selected`;
}

function SelectionBar(props: SelectionBarProps) {
  const styles = useStyles(makeStyles);

  return (
    <View style={[styles.StatusBarStyle, props.style]}>
      <View style={styles.statusBarCancelButtonStyle}>
        <CancelButton onPress={props.onCancelButton} />
      </View>

      <Text style={styles.textElementsSelectedStyle}>
        {selectedElementsToString(props.selectedNb)}
      </Text>

      <View style={styles.statusBarSelectAllButtonStyle}>
        <SelectAllButton onPress={props.onSelectAllButton} />
      </View>
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    StatusBarStyle: {
      width: '100%',
      backgroundColor: colors.BACKGROUND,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      padding: 10,
    },
    statusBarCancelButtonStyle: {},
    statusBarSelectAllButtonStyle: {},
    textElementsSelectedStyle: {
      ...typography(colors).largeTextBold,
    },
  });

export default React.memo(SelectionBar);
