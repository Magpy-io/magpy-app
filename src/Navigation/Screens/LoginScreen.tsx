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
import {typography, textSize} from '~/styles/typography';
import validator from 'validator';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .required('No email provided')
        .test('validateEmail', 'Invalid email', value => validator.isEmail(value)),
    password: Yup.string().required('No password provided'),
});

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardDismissingView>
                <ScreenTitle title="Login to your account" />
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
                <Text style={{color: appColors.TEXT}}>Don't have an account ? </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                    style={{paddingVertical: spacing.spacing_s}}>
                    <Text style={{color: appColors.ACCENT, fontWeight: 'bold'}}>
                        Register !
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function LoginForm() {
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
                            icon="mail"
                        />
                        <>
                            <PasswordInput
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                error={errors.password}
                            />
                            <ForgotPassword />
                        </>
                    </ViewWithGap>
                    <PrimaryButton
                        title="Sign In"
                        onPress={() => {
                            handleSubmit();
                        }}
                        containerStyle={{marginTop: spacing.spacing_xxl}}
                        buttonStyle={{paddingHorizontal: spacing.spacing_xxl_2}}
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
                paddingVertical: spacing.spacing_s,
                alignSelf: 'center',
            }}
            onPress={() => {}}>
            <Text
                style={{
                    color: appColors.ACCENT,
                    fontWeight: 'bold',
                    ...textSize.medium,
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
    container: {
        flex: 1,
        paddingHorizontal: spacing.spacing_xl,
        backgroundColor: appColors.BACKGROUND,
    },
});
