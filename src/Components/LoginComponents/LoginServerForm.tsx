import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { PrimaryButtonExtraWide } from '~/Components/CommonComponents/Buttons';
import ViewWithGap from '~/Components/CommonComponents/ViewWithGap';
import LoginTextInput from '~/Components/LoginComponents/LoginTextInput';
import { PasswordInput } from '~/Components/LoginComponents/PasswordInput';
import { useMainContextFunctions } from '~/Context/Contexts/MainContext';
import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import { GetTokenLocal, TokenManager } from '~/Helpers/ServerQueries';
import { useStyles } from '~/Hooks/useStyles';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { textSize } from '~/Styles/typography';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('No name provided'),
  password: Yup.string().required('No password provided'),
});

export function LoginServerForm() {
  const { setCurrentServerReachable } = useServerContextFunctions();
  const { setIsNewUser } = useMainContextFunctions();
  const styles = useStyles(makeStyles);

  const onSubmit = async (values: { username: string; password: string }) => {
    try {
      const loginRet = await GetTokenLocal.Post(values);
      if (loginRet.ok) {
        const token = TokenManager.GetUserToken();
        setCurrentServerReachable(token);
        setIsNewUser(false);
      } else {
        console.log(loginRet);
      }
    } catch (err) {
      console.log('Login Error', err);
    }
  };
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={onSubmit}>
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View>
          <ViewWithGap gap={spacing.spacing_m} style={styles.formView}>
            <LoginTextInput
              testID="nameEntry"
              placeholder="Name"
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              error={errors.username}
              icon="person"
            />
            <PasswordInput
              testID="passwordEntry"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={errors.password}
            />
          </ViewWithGap>
          <PrimaryButtonExtraWide
            testID="loginButton"
            title="Sign Into Server"
            onPress={() => {
              handleSubmit();
            }}
          />
        </View>
      )}
    </Formik>
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
