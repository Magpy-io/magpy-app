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
import { ClaimServerLocal, GetTokenLocal, TokenManager } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { useToast } from '~/Hooks/useToast';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';
import { spacing } from '~/Styles/spacing';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .required('No name provided')
    .min(3, 'Should be at least 3 characters'),
  password: Yup.string().required('No password provided'),
});

export function ClaimServerForm() {
  const { setCurrentSelectingServerReachable } = useServerContextFunctions();
  const { showToastError } = useToast();
  const { navigate } = useMainStackNavigation();

  const onSubmit = async (values: { username: string; password: string }) => {
    try {
      const ret = await ClaimServerLocal.Post(values);
      if (ret.ok) {
        const loginRet = await GetTokenLocal.Post(values);
        if (loginRet.ok) {
          const token = TokenManager.GetUserToken();
          setCurrentSelectingServerReachable(token);
          navigate('Tabs');
        } else {
          LOG.error(loginRet.message);
          showToastError('Unexpected error while connecting to server');
        }
      } else {
        LOG.error(ret.message);
        if (ret.errorCode == 'SERVER_ALREADY_CLAIMED') {
          showToastError('Server already claimed by another user.');
        } else {
          showToastError('Unexpected error while claiming server');
        }
      }
    } catch (err) {
      LOG.error(err);
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
      validationSchema={RegisterSchema}
      onSubmit={onSubmit}>
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View>
          <ViewWithGap gap={spacing.spacing_m} style={styles.viewStyle}>
            <LoginTextInput
              placeholder="Name"
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              error={errors.username}
              icon="person"
            />
            <PasswordInput
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={errors.password}
            />
          </ViewWithGap>
          <PrimaryButtonExtraWide
            title="Claim server"
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
