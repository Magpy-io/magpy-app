import React from 'react';

import { useAuthContext } from '~/Context/Contexts/AuthContext';
import { useLocalAccountContext } from '~/Context/Contexts/LocalAccountContext';
import { useMainContext } from '~/Context/Contexts/MainContext';
import { useServerClaimContext } from '~/Context/Contexts/ServerClaimContext';

import { LoginStackNavigator } from './Navigators/LoginStackNavigator';
import { MainStackNavigator } from './Navigators/MainStackNavigator';
import { ServerSelectNavigator } from './Navigators/ServerSelectNavigator';
import { SplashScreenNavigator } from './Navigators/SplashScreenNavigator';
import ServerLoginScreen from './Screens/ServerLoginScreen';

export const Root = () => {
  const { token, loading } = useAuthContext();
  const { hasServer } = useServerClaimContext();

  const { hasSavedClaimedServer, serverToken } = useLocalAccountContext();

  const { isUsingLocalAccount, isUsingLocalAccountLoaded } = useMainContext();

  if (!isUsingLocalAccountLoaded) {
    return <SplashScreenNavigator />;
  }

  if (isUsingLocalAccount) {
    if (!hasSavedClaimedServer) {
      return <ServerSelectNavigator />;
    }

    if (!serverToken) {
      return <ServerLoginScreen />;
    }

    return <MainStackNavigator />;
  }

  if (!isUsingLocalAccount) {
    if (loading) {
      return <SplashScreenNavigator />;
    }

    if (!token) {
      return <LoginStackNavigator />;
    }

    if (!hasServer) {
      return <ServerSelectNavigator />;
    }

    return <MainStackNavigator />;
  }
};
