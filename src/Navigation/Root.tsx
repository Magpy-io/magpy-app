import React from 'react';

import { useAuthContext } from '~/Context/UseContexts/useAuthContext';
import { useServerClaimContext } from '~/Context/UseContexts/useClaimServerContext';

import { LoginStackNavigator } from './Navigators/LoginStackNavigator';
import { MainStackNavigator } from './Navigators/MainStackNavigator';
import ServerSelectScreen from './Screens/ServerSelectScreen';
import SplashScreen from './Screens/SplashScreen';

export const Root = () => {
  const { token, loading } = useAuthContext();
  const { hasServer } = useServerClaimContext();

  if (loading) {
    return <SplashScreen />;
  } else if (!token) {
    return <LoginStackNavigator />;
  } else if (!hasServer) {
    return <ServerSelectScreen />;
  } else {
    return <MainStackNavigator />;
  }
};
