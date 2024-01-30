import React from 'react';

import { render } from '@testing-library/react-native';

import LoginScreen from '../src/Navigation/Screens/LoginStackNavigation/LoginScreen';

it('renders correctly', () => {
  render(<LoginScreen />);
});
