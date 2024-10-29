import RNFS from 'react-native-fs';
import { consoleTransport, fileAsyncTransport, logger } from 'react-native-logs';

import { LOGS_FOLDER_PATH } from './ShareLogs';

const LOGS_FOLDER_NAME = 'ReactNative';

export const LOG = createLogger();

function createLogger() {
  const log = logger.createLogger({
    levels: {
      info: 0,
      debug: 1,
      warn: 2,
      error: 3,
    },
    severity: 'debug',
    transport: [consoleTransport, fileAsyncTransport],
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
      filePath: LOGS_FOLDER_PATH + '/' + LOGS_FOLDER_NAME,
    },
    dateFormat: 'iso',
  });

  return log;
}
