import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CancelButton from '~/Components/CommonComponents/CancelButton';
import SelectAllButton from '~/Components/CommonComponents/SelectAllButton';
import { appColors } from '~/styles/colors';
import { typography } from '~/styles/typography';

type StatusBarComponentProps = {
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

function StatusBarGridComponent(props: StatusBarComponentProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.StatusBarStyle, props.style, { paddingTop: insets.top }]}>
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

const styles = StyleSheet.create({
  StatusBarStyle: {
    width: '100%',
    backgroundColor: appColors.BACKGROUND,
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
    ...typography.largeText,
  },
});

export default React.memo(StatusBarGridComponent);
