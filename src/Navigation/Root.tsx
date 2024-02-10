import React from 'react';

import { useAuthContext } from '~/Context/UseContexts/useAuthContext';
import { useServerClaimContext } from '~/Context/UseContexts/useClaimServerContext';

import { LoginStackNavigator } from './Navigators/LoginStackNavigator';
import { MainStackNavigator } from './Navigators/MainStackNavigator';
import { ServerSelectNavigator } from './Navigators/ServerSelectNavigator';
import { SplashScreenNavigator } from './Navigators/SplashScreenNavigator';

export const Root = () => {
  const { token, loading } = useAuthContext();
  const { hasServer } = useServerClaimContext();

  if (loading) {
    return <SplashScreenNavigator />;
  } else if (!token) {
    return <LoginStackNavigator />;
  } else if (!hasServer) {
    return <ServerSelectNavigator />;
  } else {
    return <MainStackNavigator />;
  }
};
