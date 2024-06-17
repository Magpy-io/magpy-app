import React from 'react';
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
import { ErrorBackendUnreachable } from '~/Helpers/BackendQueries/ExceptionsManager';
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

  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    try {
      const ret = await Register.Post(values);
      if (ret.ok) {
        try {
          const loginRet = await Login.Post({
            email: values.email,
            password: values.password,
          });
          console.log('login result', loginRet);
          if (loginRet.ok) {
            const authentificated = await authenticate();

            if (authentificated) {
              if (isNewUser) {
                navigate('ServerSelect');
              } else {
                navigate('Tabs');
              }
            }
          }
        } catch (err) {
          console.log('login Err', err);
        }
      } else {
        console.log('Register error', ret.message);
      }
    } catch (err) {
      if (err instanceof ErrorBackendUnreachable) {
        console.log('Backend unreachable');
      } else {
        console.log(err);
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
              showValidation
            />
            <LoginTextInput
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
          <PrimaryButtonExtraWide
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
  viewStyle: {
    paddingTop: spacing.spacing_xxl_3,
    paddingBottom: spacing.spacing_xxl,
  },
});
