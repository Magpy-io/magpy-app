import {useState} from 'react';
import {
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';

function FormError({error}: {error: string | undefined}) {
    if (error) {
        return (
            <Text
                style={{
                    color: colors.COLOR_ERROR_500,
                    paddingTop: spacing.spacing_xxs,
                    paddingLeft: spacing.spacing_l,
                }}>
                {error}
            </Text>
        );
    } else return <></>;
}

type PasswordInputProps = {
    error: string | undefined;
    showErrors: boolean;
} & RNTextInputProps;

export function PasswordInput(props: PasswordInputProps) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const showError = props.showErrors && props.value !== '';
    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: spacing.spacing_l,
                    borderColor: colors.COLOR_SECONDARY_300,
                    borderWidth: 1,
                    borderRadius: spacing.spacing_s,
                }}>
                <RNTextInput
                    placeholder="Password"
                    placeholderTextColor={colors.COLOR_SECONDARY_300}
                    secureTextEntry={!passwordVisible}
                    style={{flex: 1, height: spacing.spacing_xxl_3}}
                    {...props}
                />
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
            </View>
            {showError && <FormError error={props.error} />}
        </View>
    );
}

type TextInputProps = {
    error: string | undefined;
    showErrors: boolean;
} & RNTextInputProps;

export function TextInput(props: TextInputProps) {
    const showError = props.showErrors && props.value !== '';

    return (
        <View>
            <RNTextInput
                style={{
                    paddingLeft: spacing.spacing_l,
                    borderColor: colors.COLOR_SECONDARY_300,
                    borderWidth: 1,
                    borderRadius: spacing.spacing_s,
                    height: spacing.spacing_xxl_3,
                }}
                placeholderTextColor={colors.COLOR_SECONDARY_300}
                {...props}
            />
            {showError && <FormError error={props.error} />}
        </View>
    );
}
