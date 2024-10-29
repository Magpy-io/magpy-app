import RNFS from 'react-native-fs';
import { consoleTransport, fileAsyncTransport, logger } from 'react-native-logs';

import { LOGS_FOLDER_PATH } from './ShareLogs';

export const LOG = createLogger();

function createLogger() {
  const log = logger.createLogger({
    transport: [consoleTransport, fileAsyncTransport],
    transportOptions: {
      colors: {
        debug: 'blueBright',
        info: 'default',
        warn: 'yellowBright',
        error: 'redBright',
      },
      // @ts-expect-error react-native-logs asks for properties only available on expo projects
      FS: RNFS,
      fileName: 'log_{date-today}.txt',
      fileNameDateType: 'iso',
      filePath: LOGS_FOLDER_PATH,
    },
    dateFormat: 'iso',
  });

  return log;
}
