import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import { ChevronIcon } from '../CommonComponents/Icons';

type SettingComponentProps = {
  title: string;
  onPress: () => void;
  icon: JSX.Element;
};

export default function SettingComponent({ icon, title, onPress }: SettingComponentProps) {
  const styles = useStyles(makeStyles);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconTitle}>
        {icon}
        <Text style={styles.titleStyle}>{title}</Text>
      </View>
      <ChevronIcon />
    </TouchableOpacity>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    titleStyle: {
      ...typography(colors).mediumText,
    },
    iconTitle: {
      flexDirection: 'row',
      gap: spacing.spacing_s,
      alignItems: 'center',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.spacing_s,
    },
  });
