import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

type SettingEntryComponentProps = {
  title: string;
  onPress?: () => void;
  icon?: JSX.Element;
  componentEnd?: JSX.Element;
  style?: TextStyle;
};

export default function SettingEntryComponent({
  icon,
  componentEnd,
  title,
  onPress,
  style,
}: SettingEntryComponentProps) {
  const styles = useStyles(makeStyles);

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={styles.container}>
        <View style={styles.iconTitle}>
          {icon}
          <Text style={[styles.titleStyle, style]}>{title}</Text>
        </View>
        {componentEnd}
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    titleStyle: {
      ...typography(colors).largeText,
      flex: 1,
    },
    iconTitle: {
      flexDirection: 'row',
      gap: spacing.spacing_s,
      alignItems: 'center',
      flex: 1,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: spacing.spacing_xxl_2,
    },
  });
