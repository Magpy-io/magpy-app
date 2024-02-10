import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import { Icon } from 'react-native-elements';

import { useTheme } from '~/Context/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { borderRadius, spacing } from '~/Styles/spacing';

import FormError from './FormError';
import PasswordRequirements from './PasswordRequirements';
import ValidInputIndicator from './ValidInputIndicator';

type PasswordInputProps = {
  error: string | undefined;
  showPasswordRequirements?: boolean;
  showValidation?: boolean;
} & TextInputProps;

export function PasswordInput(props: PasswordInputProps) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const inputRef = useRef<TextInput>(null);
  const showError = !inputRef.current?.isFocused() && props.value !== '';

  return (
    <View>
      <View style={styles.viewStyle}>
        <TextInput
          testID={props.testID}
          placeholder="Password"
          placeholderTextColor={colors.TEXT_LIGHT}
          secureTextEntry={!passwordVisible}
          style={styles.textInputStyle}
          ref={inputRef}
          autoCapitalize="none"
          {...props}
        />
        {
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.hideIconContainer}>
            <Icon
              name={passwordVisible ? 'visibility-off' : 'visibility'}
              size={16}
              disabled={props.value === ''}
              disabledStyle={{ backgroundColor: colors.BACKGROUND }}
              color={props.value === '' ? colors.TEXT_LIGHT : colors.TEXT}
            />
          </TouchableOpacity>
        }
        {props.showValidation &&
        props.value !== '' &&
        !props.error &&
        !inputRef.current?.isFocused() ? (
          <ValidInputIndicator />
        ) : (
          <View style={styles.labelIconView}>
            <Icon
              name="lock"
              size={16}
              color={props.value === '' ? colors.TEXT_LIGHT : colors.TEXT}
            />
          </View>
        )}
      </View>
      {props.showPasswordRequirements && inputRef.current?.isFocused() && (
        <PasswordRequirements />
      )}
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
    hideIconContainer: {
      paddingHorizontal: spacing.spacing_l,
      height: spacing.spacing_xxl_3,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    textInputStyle: {
      flex: 1,
      height: spacing.spacing_xxl_3,
    },
    viewStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: spacing.spacing_xxl_2,
      borderColor: colors.FORM_BORDER,
      borderWidth: 0.5,
      borderRadius: borderRadius.input,
    },
  });
