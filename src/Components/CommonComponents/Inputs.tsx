import {ElementRef, useEffect, useRef, useState} from 'react';
import {
    Keyboard,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import {typography, textSize} from '~/styles/typography';

function FormError({error}: {error: string | undefined}) {
    if (error) {
        return (
            <View
                style={{
                    paddingTop: spacing.spacing_xxs,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <Icon name="cancel" size={16} color={colors.COLOR_ERROR_500} />
                <Text
                    style={{
                        paddingLeft: spacing.spacing_xxs,
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
                    borderColor: colors.COLOR_SECONDARY_300,
                    borderWidth: 1,
                    borderRadius: spacing.spacing_s,
                }}>
                <RNTextInput
                    placeholder="Password"
                    placeholderTextColor={colors.COLOR_SECONDARY_300}
                    secureTextEntry={!passwordVisible}
                    style={{flex: 1, height: spacing.spacing_xxl_3}}
                    ref={inputRef}
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
                            size={18}
                            disabled={props.value === ''}
                            disabledStyle={{backgroundColor: 'white'}}
                            color={
                                props.value === ''
                                    ? colors.COLOR_SECONDARY_300
                                    : colors.COLOR_SECONDARY_500
                            }
                        />
                    </TouchableOpacity>
                }
                {props.value !== '' && !props.error && !inputRef.current?.isFocused() ? (
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
                            color={
                                props.value === ''
                                    ? colors.COLOR_SECONDARY_300
                                    : colors.COLOR_SECONDARY_500
                            }
                        />
                    </View>
                )}
            </View>

            {showError && <FormError error={props.error} />}
        </View>
    );
}

type TextInputProps = {
    error: string | undefined;
    icon: string;
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
                    borderColor: colors.COLOR_SECONDARY_300,
                    borderWidth: 1,
                    borderRadius: spacing.spacing_s,
                    height: spacing.spacing_xxl_3,
                }}>
                <RNTextInput
                    style={{
                        flex: 1,
                    }}
                    placeholderTextColor={colors.COLOR_SECONDARY_300}
                    ref={inputRef}
                    {...props}
                />
                {props.value !== '' && !props.error && !inputRef.current?.isFocused() ? (
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
                            color={
                                props.value === ''
                                    ? colors.COLOR_SECONDARY_300
                                    : colors.COLOR_SECONDARY_500
                            }
                        />
                    </View>
                )}
            </View>

            {showError && <FormError error={props.error} />}
        </View>
    );
}
