import React from 'react';
import { StyleSheet } from 'react-native';

import { Button, ButtonProps } from 'react-native-elements';

import { appColors } from '~/styles/colors';
import { borderRadius, spacing } from '~/styles/spacing';

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
  buttonStyle: {
    backgroundColor: appColors.PRIMARY,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.spacing_s,
    paddingHorizontal: spacing.spacing_xl,
  },
  containerStyle: {
    alignSelf: 'center',
  },
});
