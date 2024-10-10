import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Formik } from 'formik';
import validator from 'validator';
import * as Yup from 'yup';

import { PrimaryButtonExtraWide } from '~/Components/CommonComponents/Buttons';
import ViewWithGap from '~/Components/CommonComponents/ViewWithGap';
import LoginTextInput from '~/Components/LoginComponents/LoginTextInput';
import { PasswordInput } from '~/Components/LoginComponents/PasswordInput';
import { useAuthContextFunctions } from '~/Context/Contexts/AuthContext';
import { useMainContext } from '~/Context/Contexts/MainContext';
import { Login, Register } from '~/Helpers/BackendQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { useToast } from '~/Hooks/useToast';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';
import { spacing } from '~/Styles/spacing';

const specialChars = /(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])/;

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

export default function RegisterForm() {
  const { authenticate } = useAuthContextFunctions();
  const { isNewUser } = useMainContext();
  const { navigate } = useMainStackNavigation();

  const [submitClicked, setSubmitClicked] = useState(false);

  const { showToastError } = useToast();

  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    try {
      const ret = await Register.Post(values);
      if (ret.ok) {
        const loginRet = await Login.Post({
          email: values.email,
          password: values.password,
        });
        console.log('login result', loginRet);

        let authentificated = false;

        if (loginRet.ok) {
          authentificated = await authenticate();

          if (authentificated) {
            if (isNewUser) {
              navigate('ServerSelect');
            } else {
              navigate('Tabs');
            }
          }
        }

        if (!authentificated) {
          showToastError('Unexpected error while registering your account.');
        }
      } else {
        console.log('Register error', ret);

        if (
          ret.errorCode == 'INVALID_EMAIL' ||
          ret.errorCode == 'INVALID_NAME' ||
          ret.errorCode == 'INVALID_PASSWORD'
        ) {
          showToastError('Invalid registration data, please re-check your inputs.');
        } else if (ret.errorCode == 'EMAIL_TAKEN') {
          showToastError('Email is already registered, please use a different one.');
        } else {
          showToastError('Unexpected error while connecting to server');
        }
      }
    } catch (err) {
      console.log('Register Error', err);

      if (err instanceof ErrorServerUnreachable) {
        showToastError('Server unreachable');
      } else {
        showToastError('Unexpected error while connecting to server');
      }
    }
  };

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={RegisterSchema}
      onSubmit={onSubmit}>
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View>
          <ViewWithGap gap={spacing.spacing_m} style={styles.viewStyle}>
            <LoginTextInput
              placeholder="Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              error={errors.name}
              icon="person"
              submitClicked={submitClicked}
            />
            <LoginTextInput
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={errors.email}
              icon="mail"
              submitClicked={submitClicked}
            />
            <PasswordInput
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={errors.password}
              showPasswordRequirements
              submitClicked={submitClicked}
            />
          </ViewWithGap>
          <PrimaryButtonExtraWide
            title="Register"
            onPress={() => {
              setSubmitClicked(true);
              handleSubmit();
            }}
          />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    paddingTop: spacing.spacing_xxl_3,
    paddingBottom: spacing.spacing_xxl,
  },
});
