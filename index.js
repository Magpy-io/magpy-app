import { AppRegistry } from 'react-native';

import App from './App';
import { name } from './app.json';
import { UploadPhotoTask } from './src/HeadlessTasks/UploadPhotoTask';

AppRegistry.registerComponent(name, () => App);
AppRegistry.registerHeadlessTask('MyTask', () => UploadPhotoTask);
