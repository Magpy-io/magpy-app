import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Text } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

type ElementProps = {
  title: string;
  selected?: boolean;
  onPress: () => void;
};

export default function Element({ title, selected, onPress }: ElementProps) {
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      style={[styles.elementView, selected ? styles.selectedElementView : {}]}
      onPress={onPress}>
      <Text style={[styles.elementTitle, selected ? styles.selectedElementTitle : {}]}>
        {title}
      </Text>
    </Pressable>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    elementView: {
      paddingVertical: spacing.spacing_s,
      paddingHorizontal: spacing.spacing_l,
      backgroundColor: colors.FILTER_ELEMENT,
      borderRadius: borderRadius.small,
    },
    elementTitle: {
      ...typography(colors).mediumTextBold,
    },
    selectedElementView: {
      backgroundColor: colors.BACKGROUND_INVERSE,
    },
    selectedElementTitle: {
      color: colors.TEXT_INVERSE,
    },
  });
