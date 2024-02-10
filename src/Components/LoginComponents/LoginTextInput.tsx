import React, { useRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { Icon } from 'react-native-elements';

import { useTheme } from '~/Context/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';

import FormError from './FormError';
import ValidInputIndicator from './ValidInputIndicator';

type LoginTextInputProps = {
  error: string | undefined;
  icon: string;
  showValidation?: boolean;
} & TextInputProps;

export default function LoginTextInput(props: LoginTextInputProps) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();

  const inputRef = useRef<TextInput>(null);
  const showError = !inputRef?.current?.isFocused() && props.value !== '';
  return (
    <View>
      <View style={styles.viewStyle}>
        <TextInput
          testID={props.testID}
          style={styles.textInputStyle}
          placeholderTextColor={colors.TEXT_LIGHT}
          ref={inputRef}
          {...props}
        />
        {props.showValidation &&
        props.value !== '' &&
        !props.error &&
        !inputRef.current?.isFocused() ? (
          <ValidInputIndicator />
        ) : (
          <View style={styles.labelIconView}>
            <Icon
              name={props.icon}
              size={16}
              color={props.value === '' ? colors.TEXT_LIGHT : colors.TEXT}
            />
          </View>
        )}
      </View>

      {showError && <FormError error={props.error} />}
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    labelIconView: {
      position: 'absolute',
      left: spacing.spacing_l,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    },
    textInputStyle: {
      flex: 1,
    },
    viewStyle: {
      flexDirection: 'row',
      paddingLeft: spacing.spacing_xxl_2,
      borderColor: colors.FORM_BORDER,
      borderWidth: 0.5,
      borderRadius: borderRadius.input,
      height: spacing.spacing_xxl_3,
    },
  });
