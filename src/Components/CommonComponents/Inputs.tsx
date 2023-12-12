import {
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    View,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import {useState} from 'react';

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
} & RNTextInputProps;

export function PasswordInput(props: PasswordInputProps) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: spacing.spacing_l,
                    borderColor: colors.COLOR_SECONDARY_300,
                    borderWidth: 1,
                    borderRadius: spacing.spacing_s,
                }}>
                <RNTextInput
                    placeholder="Password"
                    placeholderTextColor={colors.COLOR_SECONDARY_300}
                    secureTextEntry={!passwordVisible}
                    style={{flex: 1}}
                    {...props}
                />
                <Icon
                    name={passwordVisible ? 'visibility-off' : 'visibility'}
                    size={18}
                    onPress={togglePasswordVisibility}
                    disabled={props.value === ''}
                    disabledStyle={{backgroundColor: 'white'}}
                    color={
                        props.value === ''
                            ? colors.COLOR_SECONDARY_300
                            : colors.COLOR_SECONDARY_500
                    }
                />
            </View>
            <FormError error={props.error} />
        </View>
    );
}

type TextInputProps = {
    error: string | undefined;
} & RNTextInputProps;

export function TextInput(props: TextInputProps) {
    return (
        <View>
            <RNTextInput
                style={{
                    paddingLeft: spacing.spacing_l,
                    borderColor: colors.COLOR_SECONDARY_300,
                    borderWidth: 1,
                    borderRadius: spacing.spacing_s,
                }}
                placeholderTextColor={colors.COLOR_SECONDARY_300}
                {...props}
            />
            <FormError error={props.error} />
        </View>
    );
}
