
import React from 'react';
import 'react-native';
import {
  NativeModules,
} from 'react-native';


jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js');


jest.mock('@react-navigation/native-stack', () => {
  return  {
    createNativeStackNavigator: () => {}
  }
});
jest.mock('react-native-fs', () => {});
jest.mock('@react-native-camera-roll/camera-roll', () => {});
jest.mock('react-native-gesture-handler', () => {});
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: () => {}
  }
});
jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: () => {
      return {top:0, bottom:0}
    }
  }
})
import { render } from '@testing-library/react-native';

import App from '../App';

it('renders correctly', () => {
  render(<App />);
});
