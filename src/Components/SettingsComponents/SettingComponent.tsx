import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from 'react-native-elements';

import { spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

import { ChevronIcon } from '../CommonComponents/Icons';

type SettingComponentProps = {
  title: string;
  onPress: () => void;
  icon: JSX.Element;
};

export default function SettingComponent({ icon, title, onPress }: SettingComponentProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconTitle}>
        {icon}
        <Text style={{ ...typography.mediumText }}>{title}</Text>
      </View>
      <ChevronIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconTitle: {
    flexDirection: 'row',
    gap: spacing.spacing_s,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.spacing_xs,
  },
});
