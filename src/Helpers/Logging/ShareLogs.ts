import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { zip } from 'react-native-zip-archive';

export async function ShareLogsFolder() {
  const sourcePath = RNFS.ExternalDirectoryPath + '/logs';
  const targetPath = RNFS.CachesDirectoryPath + '/logs.zip';

  const path = await zip(sourcePath, targetPath);

  return await Share.open({
    url: 'file://' + path,
  });
}
