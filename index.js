import { AppRegistry } from 'react-native';

// This library works as a polyfill for the global crypto.getRandomValues.
// This will allow the uuid library to work
import 'react-native-get-random-values'

import App from './App';
import { name } from './app.json';

AppRegistry.registerComponent(name, () => App);
