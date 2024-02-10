import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../Screens/LoginStackNavigation/LoginScreen';
import RegisterScreen from '../Screens/LoginStackNavigation/RegisterScreen';

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
  ServerSelect: undefined;
};

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

export function LoginStackNavigator() {
  return (
    <LoginStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <LoginStack.Screen name="Login" component={LoginScreen} />
      <LoginStack.Screen name="Register" component={RegisterScreen} />
    </LoginStack.Navigator>
  );
}
