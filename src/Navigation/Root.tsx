import React from 'react';

import { useAuthContext } from '~/Context/Contexts/AuthContext';
import { useMainContext } from '~/Context/Contexts/MainContext';

import { MainStackNavigator } from './Navigators/MainStackNavigator';
import SplashScreen from './Screens/SplashScreen';

export const Root = () => {
  const { loading } = useAuthContext();

  const { isNewUser, isUsingLocalAccount, isContextLoaded } = useMainContext();

  if (!isContextLoaded) {
    return <SplashScreen />;
  }

  if (!isUsingLocalAccount && loading) {
    return <SplashScreen />;
  }

  if (isNewUser) {
    return <MainStackNavigator initialScreen="Welcome" />;
  }

  return <MainStackNavigator initialScreen="Tabs" />;
};
