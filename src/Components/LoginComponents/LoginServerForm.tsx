import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { PrimaryButtonExtraWide } from '~/Components/CommonComponents/Buttons';
import ViewWithGap from '~/Components/CommonComponents/ViewWithGap';
import LoginTextInput from '~/Components/LoginComponents/LoginTextInput';
import { PasswordInput } from '~/Components/LoginComponents/PasswordInput';
import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import { LOG } from '~/Helpers/Logging/Logger';
import { GetTokenLocal, TokenManager } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { useStyles } from '~/Hooks/useStyles';
import { useToast } from '~/Hooks/useToast';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { textSize } from '~/Styles/typography';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('No name provided'),
  password: Yup.string().required('No password provided'),
});

export function LoginServerForm() {
  const { setCurrentSelectingServerReachable } = useServerContextFunctions();
  const styles = useStyles(makeStyles);
  const { showToastError } = useToast();

  const { navigate } = useMainStackNavigation();

  const onSubmit = async (values: { username: string; password: string }) => {
    try {
      const loginRet = await GetTokenLocal.Post(values);
      if (loginRet.ok) {
        const token = TokenManager.GetUserToken();
        setCurrentSelectingServerReachable(token);
        navigate('Tabs');
      } else {
        LOG.error(loginRet);

        if (loginRet.errorCode == 'INVALID_CREDENTIALS') {
          showToastError('Invalid username or password');
        } else if (loginRet.errorCode == 'SERVER_NOT_CLAIMED') {
          showToastError('Server is not claimed');
        } else {
          showToastError('Unexpected error while connecting to server');
        }
      }
    } catch (err) {
      LOG.error('Login Error', err);
      if (err instanceof ErrorServerUnreachable) {
        showToastError('Server unreachable');
      } else {
        showToastError('Unexpected error while claiming server');
      }
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
