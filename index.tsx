import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as Queries from '~/Helpers/Queries';
import RNFS from 'react-native-fs';

import {NativeModules} from 'react-native';
const {MainModule} = NativeModules;

AppRegistry.registerComponent(appName, () => App);

const f = async (photo: {
    path: string;
    name: string;
    date: string;
    height: number;
    width: number;
    size: number;
}) => {
    const res = await RNFS.readFile(photo.path, 'base64');

    const result = await Queries.addPhotoWithProgress({
        name: photo.name,
        fileSize: photo.size,
        width: photo.width,
        height: photo.height,
        date: new Date(photo.date).toJSON(),
        path: photo.path,
        image64: res,
    });

    if (result.ok) {
        MainModule.onJsTaskFinished({code: 'SUCCESS'});
        console.log('photo uploaded');
    } else {
        MainModule.onJsTaskFinished({code: 'ERROR'});
        console.log('photo upload error');
        console.log(result.errorCode);
    }
};

AppRegistry.registerHeadlessTask('MyTask', () => f);
