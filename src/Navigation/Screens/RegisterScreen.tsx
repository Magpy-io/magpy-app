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
import ScreenTitle from '~/Components/CommonComponents/ScreenTitle';
import ViewWithGap from '~/Components/CommonComponents/ViewWithGap';
import {appColors, colors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import validator from 'validator';

import * as QueriesBackend from '~/Helpers/backendImportedQueries';

const specialChars = /(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?\/])/;

const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('No name provided').min(3, 'Should be at least 3 characters'),
    email: Yup.string()
        .required('No email provided')
        .test('validateEmail', 'Invalid email', value => validator.isEmail(value)),
    password: Yup.string()
        .required('No password provided')
        .min(8, 'Should be at least 8 characters')
        .max(16, 'Should be at most 16 characters')
        .matches(/^(?=.*[a-z])/, 'Should contain a lowercase character')
        .matches(/^(?=.*[A-Z])/, 'Should contain a uppercase character')
        .matches(/^(?=.*[0-9])/, 'Should contain a number')
        .matches(specialChars, 'Should contain a special character'),
});

export default function RegisterScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardDismissingView>
                <ScreenTitle title="Create Account" />
                <RegisterForm />
            </KeyboardDismissingView>
            <RegisterFooter />
        </SafeAreaView>
    );
}

function RegisterFooter() {
    const navigation = useNavigation();
    return (
        <View style={styles.loginFooterStyle}>
            <GoogleSignIn />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: appColors.TEXT}}>Already a client ? </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Login');
                    }}
                    style={{paddingVertical: spacing.spacing_s}}>
                    <Text style={{color: appColors.ACCENT, fontWeight: 'bold'}}>
                        Sign In !
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function RegisterForm() {
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
            initialValues={{name: '', email: '', password: ''}}
            validationSchema={RegisterSchema}
            onSubmit={async values => {
                try {
                    QueriesBackend.SetPath('http://192.168.0.15:8001/');
                    const ret = await QueriesBackend.register(values);
                    console.log(ret.message);
                } catch (err) {
                    if (err instanceof QueriesBackend.ErrorBackendUnreachable) {
                        console.log('Backend unreachable');
                    } else {
                        console.log(err);
                    }
                }
            }}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                <View>
                    <ViewWithGap
                        gap={spacing.spacing_m}
                        style={{
                            paddingTop: spacing.spacing_xxl_3,
                            paddingBottom: spacing.spacing_xxl,
                        }}>
                        <TextInput
                            placeholder="Name"
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            value={values.name}
                            error={errors.name}
                            icon="person"
                            showValidation
                        />
                        <TextInput
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            error={errors.email}
                            icon="mail"
                            showValidation
                        />
                        <PasswordInput
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            error={errors.password}
                            showPasswordRequirements
                            showValidation
                        />
                    </ViewWithGap>
                    <PrimaryButton
                        title="Register"
                        onPress={() => {
                            handleSubmit();
                        }}
                    />
                </View>
            )}
        </Formik>
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
    container: {
        flex: 1,
        paddingHorizontal: spacing.spacing_xl,
        backgroundColor: appColors.BACKGROUND,
    },
});
