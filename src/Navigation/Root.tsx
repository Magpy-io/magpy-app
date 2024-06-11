import React from 'react';

import { useAuthContext } from '~/Context/Contexts/AuthContext';
import { useMainContext } from '~/Context/Contexts/MainContext';

import { LoginStackNavigator } from './Navigators/LoginStackNavigator';
import { MainStackNavigator } from './Navigators/MainStackNavigator';
import { ServerSelectNavigator } from './Navigators/ServerSelectNavigator';
import SplashScreen from './Screens/SplashScreen';

export const Root = () => {
  const { token, loading } = useAuthContext();

  const { isNewUser, isUsingLocalAccount, isContextLoaded } = useMainContext();

  // Implementation of the UX Workflow defined in miro board : https://miro.com/app/board/uXjVK_TUuTo=/

  if (!isContextLoaded) {
    return <SplashScreen />;
  }

  if (!isNewUser) {
    if (isUsingLocalAccount) {
      return <MainStackNavigator />;
    }

    if (loading) {
      return <SplashScreen />;
    }

    if (token) {
      return <MainStackNavigator />;
    }

    return <LoginStackNavigator />;
  } else {
    if (token || isUsingLocalAccount) {
      return <ServerSelectNavigator />;
    }

    return <LoginStackNavigator />;
  }
};
