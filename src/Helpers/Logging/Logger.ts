import RNFS from 'react-native-fs';
import { consoleTransport, fileAsyncTransport, logger } from 'react-native-logs';

import { LOGS_FOLDER_PATH } from './ShareLogs';

const LOGS_FOLDER_NAME = 'ReactNative';
const RN_LOGS_FOLDER_PATH = LOGS_FOLDER_PATH + '/' + LOGS_FOLDER_NAME;

export const LOG = createLogger();

function createLogger() {
  return logger.createLogger({
    levels: {
      info: 0,
      debug: 1,
      warn: 2,
      error: 3,
    },
    severity: __DEV__ ? 'info' : 'debug',
    transport: __DEV__ ? [consoleTransport, fileAsyncTransport] : fileAsyncTransport,
    transportOptions: {
      colors: {
        info: 'default',
        debug: 'blueBright',
        warn: 'yellowBright',
        error: 'redBright',
      },
      // @ts-expect-error react-native-logs asks for properties only available on expo projects
      FS: RNFS,
      fileName: 'log_{date-today}.txt',
      fileNameDateType: 'iso',
      filePath: RN_LOGS_FOLDER_PATH,
    },
    dateFormat: 'iso',
  });
}
