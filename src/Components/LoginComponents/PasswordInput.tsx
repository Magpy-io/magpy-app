import { ElementRef, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Icon, Text } from 'react-native-elements';

import { appColors, colors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';
import { textSize, typography } from '~/styles/typography';

import FormError from './FormError';
import PasswordRequirements from './PasswordRequirements';
import ValidInputIndicator from './ValidInputIndicator';

type PasswordInputProps = {
  error: string | undefined;
  showPasswordRequirements?: boolean;
  showValidation?: boolean;
} & RNTextInputProps;

export function PasswordInput(props: PasswordInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const inputRef = useRef<RNTextInput>(null);
  const showError = !inputRef.current?.isFocused() && props.value !== '';

  return (
    <View>
      <View style={styles.viewStyle}>
        <RNTextInput
          placeholder="Password"
          placeholderTextColor={appColors.TEXT_LIGHT}
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
              disabledStyle={{ backgroundColor: 'white' }}
              color={props.value === '' ? appColors.TEXT_LIGHT : appColors.TEXT}
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
              color={props.value === '' ? appColors.TEXT_LIGHT : appColors.TEXT}
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

const styles = StyleSheet.create({
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
    borderColor: appColors.FORM_BORDER,
    borderWidth: 1,
    borderRadius: spacing.spacing_s,
  },
});
