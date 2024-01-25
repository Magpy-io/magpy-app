import React from 'react';
import { StyleSheet } from 'react-native';

import { Button, ButtonProps } from 'react-native-elements';

import { appColors, colors } from '~/styles/colors';
import { borderRadius, spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

export function PrimaryButton(props: ButtonProps) {
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
  return (
    <Button
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

const styles = StyleSheet.create({
  titleStyle: {
    color: appColors.TEXT_INVERSE,
  },
  titleStyleSmall: {
    ...typography.mediumTextBold,
    color: appColors.TEXT_INVERSE,
  },
  buttonStyle: {
    backgroundColor: appColors.PRIMARY,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.spacing_s,
    paddingHorizontal: spacing.spacing_xl,
  },
  containerStyle: {
    alignSelf: 'center',
  },
  buttonSmallStyle: {
    backgroundColor: appColors.PRIMARY,
    borderRadius: borderRadius.small,
    paddingVertical: spacing.spacing_xxs,
    paddingHorizontal: spacing.spacing_l,
    borderColor: appColors.PRIMARY,
    borderWidth: 1.2,
  },
  outlineButtonSmallStyle: {
    backgroundColor: colors.TRANSPARENT,
    borderRadius: borderRadius.small,
    paddingVertical: spacing.spacing_xxs,
    paddingHorizontal: spacing.spacing_l,
    borderColor: appColors.PRIMARY,
    borderWidth: 1.2,
  },
  outlineTitleStyleSmall: {
    ...typography.mediumTextBold,
    color: appColors.TEXT,
  },
});
