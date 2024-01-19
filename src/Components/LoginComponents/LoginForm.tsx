import {Formik} from 'formik';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import validator from 'validator';
import * as Yup from 'yup';
import {PrimaryButtonExtraWide} from '~/Components/CommonComponents/Buttons';
import ViewWithGap from '~/Components/CommonComponents/ViewWithGap';
import {PasswordInput} from '~/Components/LoginComponents/PasswordInput';
import TextInput from '~/Components/LoginComponents/TextInput';
import {useAuthContext} from '~/Context/AuthContext';
import {appColors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import {textSize} from '~/styles/typography';
import {Login} from '~/Helpers/BackendQueries';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .required('No email provided')
        .test('validateEmail', 'Invalid email', value => validator.isEmail(value)),
    password: Yup.string().required('No password provided'),
});

export default function LoginForm() {
    const {authenticate} = useAuthContext();
    const onSubmit = async (values: {email: string; password: string}) => {
        try {
            const loginRet = await Login.Post(values);
            if (loginRet.ok) authenticate();
        } catch (err) {
            console.log('Login Error', err);
        }
    };
    return (
        <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={LoginSchema}
            onSubmit={onSubmit}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                <View>
                    <ViewWithGap gap={spacing.spacing_m} style={styles.formView}>
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
                    <PrimaryButtonExtraWide
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
        <TouchableOpacity style={styles.forgotPasswordView} onPress={() => {}}>
            <Text style={styles.forgotPasswordText}>Forgot password ?</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    formView: {
        paddingTop: spacing.spacing_xxl_3,
        paddingBottom: spacing.spacing_xxl,
    },
    forgotPasswordView: {
        paddingVertical: spacing.spacing_s,
        alignSelf: 'center',
    },
    forgotPasswordText: {
        color: appColors.ACCENT,
        fontWeight: 'bold',
        ...textSize.medium,
    },
});