import {ElementRef, useEffect, useRef, useState} from 'react';
import {
    Keyboard,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {appColors, colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import {typography, textSize} from '~/styles/typography';

const PASSWORD_REQUIREMENTS =
    'Should have at least one uppercase, one number and one special character';

function FormError({error}: {error: string | undefined}) {
    if (error) {
        return (
            <View
                style={{
                    paddingTop: spacing.spacing_xxs,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                }}>
                <Icon name="cancel" size={16} color={colors.COLOR_ERROR_500} />
                <Text
                    style={{
                        paddingLeft: spacing.spacing_xxs,
                        flex: 1,
                        flexWrap: 'wrap',
                        ...typography.formError,
                    }}>
                    {error}
                </Text>
            </View>
        );
    } else return <></>;
}

function ValidInputIndicator() {
    return (
        <View
            style={{
                justifyContent: 'center',
                position: 'absolute',
                left: spacing.spacing_l,
                top: 0,
                bottom: 0,
            }}>
            <Icon name="check-circle" size={16} color={colors.COLOR_SUCCESS_500} />
        </View>
    );
}

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
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: spacing.spacing_xxl_2,
                    borderColor: appColors.FORM_BORDER,
                    borderWidth: 1,
                    borderRadius: spacing.spacing_s,
                }}>
                <RNTextInput
                    placeholder="Password"
                    placeholderTextColor={appColors.TEXT_LIGHT}
                    secureTextEntry={!passwordVisible}
                    style={{flex: 1, height: spacing.spacing_xxl_3}}
                    ref={inputRef}
                    autoCapitalize="none"
                    {...props}
                />
                {
                    <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={{
                            paddingHorizontal: spacing.spacing_l,
                            height: spacing.spacing_xxl_3,
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}>
                        <Icon
                            name={passwordVisible ? 'visibility-off' : 'visibility'}
                            size={16}
                            disabled={props.value === ''}
                            disabledStyle={{backgroundColor: 'white'}}
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
                    <View
                        style={{
                            position: 'absolute',
                            left: spacing.spacing_l,
                            top: 0,
                            bottom: 0,
                            justifyContent: 'center',
                        }}>
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

function PasswordRequirements() {
    return (
        <View
            style={{
                paddingTop: spacing.spacing_xxs,
                flexDirection: 'row',
                alignItems: 'flex-start',
            }}>
            <Icon name="info" size={16} color={appColors.TEXT_LIGHT} />
            <Text
                style={{
                    flex: 1,
                    flexWrap: 'wrap',
                    paddingLeft: spacing.spacing_xxs,
                    ...typography.formInfo,
                }}>
                {PASSWORD_REQUIREMENTS}
            </Text>
        </View>
    );
}

type TextInputProps = {
    error: string | undefined;
    icon: string;
    showValidation?: boolean;
} & RNTextInputProps;

export function TextInput(props: TextInputProps) {
    const inputRef = useRef<RNTextInput>(null);
    const showError = !inputRef?.current?.isFocused() && props.value !== '';
    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    paddingLeft: spacing.spacing_xxl_2,
                    borderColor: appColors.FORM_BORDER,
                    borderWidth: 1,
                    borderRadius: spacing.spacing_s,
                    height: spacing.spacing_xxl_3,
                }}>
                <RNTextInput
                    style={{
                        flex: 1,
                    }}
                    placeholderTextColor={appColors.TEXT_LIGHT}
                    ref={inputRef}
                    {...props}
                />
                {props.showValidation &&
                props.value !== '' &&
                !props.error &&
                !inputRef.current?.isFocused() ? (
                    <ValidInputIndicator />
                ) : (
                    <View
                        style={{
                            position: 'absolute',
                            left: spacing.spacing_l,
                            top: 0,
                            bottom: 0,
                            justifyContent: 'center',
                        }}>
                        <Icon
                            name={props.icon}
                            size={16}
                            color={props.value === '' ? appColors.TEXT_LIGHT : appColors.TEXT}
                        />
                    </View>
                )}
            </View>

            {showError && <FormError error={props.error} />}
        </View>
    );
}
