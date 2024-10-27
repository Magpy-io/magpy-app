import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { zip } from 'react-native-zip-archive';

export const LOGS_FOLDER_PATH = RNFS.ExternalDirectoryPath + '/logs';
export const LOGS_ZIP_FILE_PATH = RNFS.ExternalCachesDirectoryPath + '/logs.zip';

export async function ShareLogsFolder() {
  const path = await zip(LOGS_FOLDER_PATH, LOGS_ZIP_FILE_PATH);

  return await Share.open({
    url: 'file://' + path,
  });
}
