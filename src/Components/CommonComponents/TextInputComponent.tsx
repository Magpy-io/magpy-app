import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import FormError from '../LoginComponents/FormError';

export type TextInputComponentProps = {
  style?: ViewStyle;
  error?: string;
} & TextInputProps;

export default function TextInputComponent({
  style,
  error,
  ...props
}: TextInputComponentProps) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={style}>
      <View style={styles.viewStyle}>
        <TextInput
          style={styles.textInputStyle}
          placeholderTextColor={colors.TEXT_LIGHT}
          {...props}
        />
      </View>

      {error && <FormError error={error} />}
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    headerView: {
      paddingBottom: spacing.spacing_xxl,
      paddingTop: spacing.spacing_xxl_5,
    },
    title: {
      paddingHorizontal: spacing.spacing_xxl,
      textAlign: 'center',
      ...typography(colors).screenTitle,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.BACKGROUND,
    },
    textInputStyle: {
      flex: 1,
    },
    viewStyle: {
      flexDirection: 'row',
      borderColor: colors.FORM_BORDER,
      borderWidth: 0.5,
      borderRadius: borderRadius.input,
      height: spacing.spacing_xxl_3,
    },
  });
