import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Yup from 'yup';
import {PrimaryButton} from '~/Components/CommonComponents/Buttons';
import GoogleSignIn from '~/Components/CommonComponents/GoogleSignIn';
import {PasswordInput, TextInput} from '~/Components/CommonComponents/Inputs';
import KeyboardDismissingView from '~/Components/CommonComponents/KeyboardDismissingView';
import ViewWithGap from '~/Components/CommonComponents/ViewWithGap';
import {appColors, colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
GoogleSignin.configure();

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('No email provided'),
    password: Yup.string()
        .required('No password provided')
        .min(5, 'Password is too short - should be at least 5 characters'),
});

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardDismissingView>
                <ScreenTitle title="Sign In" />
                <LoginForm />
            </KeyboardDismissingView>
            <LoginFooter />
        </SafeAreaView>
    );
}

function LoginFooter() {
    const navigation = useNavigation();
    return (
        <View style={styles.loginFooterStyle}>
            <GoogleSignIn />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <Text style={{color: colors.COLOR_SECONDARY_500}}>
                    Don't have an account ?{' '}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                    style={{paddingVertical: spacing.spacing_s}}>
                    <Text style={{color: colors.COLOR_PRIMARY_500, fontWeight: 'bold'}}>
                        Register !
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function ScreenTitle({title}: {title: string}) {
    return <Text style={styles.screenTitleStyle}>{title}</Text>;
}

function LoginForm() {
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setShowErrors(false);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setShowErrors(true);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={LoginSchema}
            onSubmit={values => console.log(values)}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                <View>
                    <ViewWithGap
                        gap={spacing.spacing_m}
                        style={{
                            paddingTop: spacing.spacing_xxl_3,
                        }}>
                        <TextInput
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            error={errors.email}
                            showErrors={showErrors}
                        />
                        <PasswordInput
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            error={errors.password}
                            showErrors={showErrors}
                        />
                    </ViewWithGap>
                    <ForgotPassword />
                    <PrimaryButton
                        title="Sign In"
                        onPress={() => {
                            handleSubmit();
                        }}
                    />
                </View>
            )}
        </Formik>
    );
}

function ForgotPassword() {
    return (
        <TouchableOpacity
            style={{
                marginBottom: spacing.spacing_xxl,
                paddingVertical: spacing.spacing_s,
            }}
            onPress={() => {}}>
            <Text
                style={{
                    alignSelf: 'center',
                    fontSize: 14,
                    color: colors.COLOR_PRIMARY_500,
                }}>
                Forgot password ?
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    loginFooterStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: spacing.spacing_xxl_5,
        paddingHorizontal: spacing.spacing_xl,
        alignItems: 'center',
    },
    screenTitleStyle: {
        paddingTop: spacing.spacing_xxl_6,
        alignSelf: 'center',
        fontSize: 32,
        fontWeight: '800',
        color: appColors.TEXT_DARK,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.spacing_xl,
        backgroundColor: appColors.BACKGROUND_LIGHT,
    },
});
