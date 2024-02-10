import React from 'react';
import { StyleSheet } from 'react-native';

import { Button, ButtonProps } from 'react-native-elements';

import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

export function PrimaryButton(props: ButtonProps) {
  const styles = useStyles(makeStyles);
  return (
    <Button
      {...props}
      containerStyle={[styles.containerStyle, props.containerStyle]}
      buttonStyle={[styles.buttonStyle, props.buttonStyle]}
      titleStyle={styles.titleStyle}
    />
  );
}

export function PrimaryButtonSmall(props: ButtonProps) {
  const styles = useStyles(makeStyles);
  return (
    <Button
      {...props}
      containerStyle={[styles.containerStyle, props.containerStyle]}
      buttonStyle={[styles.buttonSmallStyle, props.buttonStyle]}
      titleStyle={styles.titleStyleSmall}
    />
  );
}

export function OutlineButtonSmall(props: ButtonProps) {
  const styles = useStyles(makeStyles);

  return (
    <Button
      {...props}
      containerStyle={[styles.containerStyle, props.containerStyle]}
      buttonStyle={[styles.outlineButtonSmallStyle, props.buttonStyle]}
      titleStyle={styles.outlineTitleStyleSmall}
    />
  );
}

export function PrimaryButtonWide(props: ButtonProps) {
  const styles = useStyles(makeStyles);

  return (
    <Button
      {...props}
      containerStyle={[styles.containerStyle, props.containerStyle]}
      buttonStyle={[
        styles.buttonStyle,
        props.buttonStyle,
        { paddingHorizontal: spacing.spacing_xxl },
      ]}
      titleStyle={styles.titleStyle}
    />
  );
}

export function PrimaryButtonExtraWide(props: ButtonProps) {
  const styles = useStyles(makeStyles);

  return (
    <Button
      testID={props.testID}
      {...props}
      containerStyle={[styles.containerStyle, props.containerStyle]}
      buttonStyle={[
        styles.buttonStyle,
        props.buttonStyle,
        { paddingHorizontal: spacing.spacing_xxl_2 },
      ]}
      titleStyle={styles.titleStyle}
    />
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    titleStyle: {
      color: colors.TEXT_INVERSE,
    },
    titleStyleSmall: {
      ...typography(colors).mediumTextBold,
      color: colors.TEXT_INVERSE,
    },
    buttonStyle: {
      backgroundColor: colors.PRIMARY,
      borderRadius: borderRadius.button,
      paddingVertical: spacing.spacing_s,
      paddingHorizontal: spacing.spacing_xl,
    },
    containerStyle: {
      alignSelf: 'center',
    },
    buttonSmallStyle: {
      backgroundColor: colors.PRIMARY,
      borderRadius: borderRadius.small,
      paddingVertical: spacing.spacing_xxs,
      paddingHorizontal: spacing.spacing_l,
      borderColor: colors.PRIMARY,
      borderWidth: 1.2,
    },
    outlineButtonSmallStyle: {
      backgroundColor: colors.TRANSPARENT,
      borderRadius: borderRadius.small,
      paddingVertical: spacing.spacing_xxs,
      paddingHorizontal: spacing.spacing_l,
      borderColor: colors.PRIMARY,
      borderWidth: 1.2,
    },
    outlineTitleStyleSmall: {
      ...typography(colors).mediumTextBold,
      color: colors.TEXT,
    },
  });
