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
import { ClaimServerLocal, GetTokenLocal, TokenManager } from '~/Helpers/ServerQueries';
import { spacing } from '~/Styles/spacing';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .required('No name provided')
    .min(3, 'Should be at least 3 characters'),
  password: Yup.string().required('No password provided'),
});

export function ClaimServerForm() {
  const { setCurrentServerReachable } = useServerContextFunctions();
  const { setIsNewUser } = useMainContextFunctions();

  const onSubmit = async (values: { username: string; password: string }) => {
    console.log('hdisofshoifhdo');
    try {
      const ret = await ClaimServerLocal.Post(values);
      if (ret.ok) {
        const loginRet = await GetTokenLocal.Post(values);
        if (loginRet.ok) {
          const token = TokenManager.GetUserToken();
          setCurrentServerReachable(token);
          setIsNewUser(false);
        } else {
          console.log(loginRet.message);
        }
      } else {
        console.log(ret.message);
      }
    } catch (err) {
      console.log(err);
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
              console.log(values);
              console.log(errors);
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
