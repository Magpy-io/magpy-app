import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import { Text } from 'react-native-elements';
import validator from 'validator';
import * as Yup from 'yup';

import { PrimaryButtonExtraWide } from '~/Components/CommonComponents/Buttons';
import ViewWithGap from '~/Components/CommonComponents/ViewWithGap';
import LoginTextInput from '~/Components/LoginComponents/LoginTextInput';
import { PasswordInput } from '~/Components/LoginComponents/PasswordInput';
import { useAuthContextFunctions } from '~/Context/Contexts/AuthContext';
import { useMainContext } from '~/Context/Contexts/MainContext';
import { Login } from '~/Helpers/BackendQueries';
import { LOG } from '~/Helpers/Logging/Logger';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { useStyles } from '~/Hooks/useStyles';
import { useToast } from '~/Hooks/useToast';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { textSize } from '~/Styles/typography';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required('No email provided')
    .test('validateEmail', 'Invalid email', value => validator.isEmail(value)),
  password: Yup.string().required('No password provided'),
});

export default function LoginForm() {
  const { authenticate } = useAuthContextFunctions();
  const styles = useStyles(makeStyles);
  const { isNewUser } = useMainContext();

  const [submitClicked, setSubmitClicked] = useState(false);

  const { navigate } = useMainStackNavigation();

  const { showToastError } = useToast();

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const loginRet = await Login.Post(values);
      if (loginRet.ok) {
        const authentificated = await authenticate();

        if (authentificated) {
          if (isNewUser) {
            navigate('ServerSelect');
          } else {
            navigate('Tabs');
          }
        }
      } else {
        LOG.error(loginRet);

        if (loginRet.errorCode == 'INVALID_CREDENTIALS') {
          showToastError('Invalid email or password');
        } else {
          showToastError('Unexpected error while connecting to server');
        }
      }
    } catch (err) {
      LOG.error('Login Error', err);

      if (err instanceof ErrorServerUnreachable) {
        showToastError('Server unreachable');
      } else {
        showToastError('Unexpected error while connecting to server');
      }
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={onSubmit}>
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View>
          <ViewWithGap gap={spacing.spacing_m} style={styles.formView}>
            <LoginTextInput
              testID="emailEntry"
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={errors.email}
              icon="mail"
              submitClicked={submitClicked}
            />
            <>
              <PasswordInput
                testID="passwordEntry"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={errors.password}
                submitClicked={submitClicked}
              />
            </>
          </ViewWithGap>
          <PrimaryButtonExtraWide
            testID="loginButton"
            title="Sign In"
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

function ForgotPassword() {
  const styles = useStyles(makeStyles);

  return (
    <TouchableOpacity style={styles.forgotPasswordView} onPress={() => {}}>
      <Text style={styles.forgotPasswordText}>Forgot password ?</Text>
    </TouchableOpacity>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    formView: {
      paddingTop: spacing.spacing_xxl_3,
      paddingBottom: spacing.spacing_xxl,
    },
    forgotPasswordView: {
      paddingVertical: spacing.spacing_s,
      alignSelf: 'center',
    },
    forgotPasswordText: {
      color: colors.ACCENT,
      fontWeight: 'bold',
      ...textSize.medium,
    },
  });
