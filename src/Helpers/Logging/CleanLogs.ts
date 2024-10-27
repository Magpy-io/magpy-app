import RNFS from 'react-native-fs';

import { LOGS_FOLDER_PATH, LOGS_ZIP_FILE_PATH } from './ShareLogs';

const DAYS_TO_DELETE_LOGS = 7;

export async function ClearOldLogFiles() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_DELETE_LOGS);

  await filterFolderOldFiles(LOGS_FOLDER_PATH, cutoffDate);

  if (await RNFS.exists(LOGS_ZIP_FILE_PATH)) {
    const zipFileInfo = await RNFS.stat(LOGS_ZIP_FILE_PATH);

    const creationDate = new Date(zipFileInfo.mtime);

    if (creationDate < cutoffDate) {
      await RNFS.unlink(LOGS_ZIP_FILE_PATH);
    }
  }
}

async function filterFolderOldFiles(path: string, date: Date) {
  const folderContent = await RNFS.readDir(path);

  for (const entry of folderContent) {
    if (entry.isFile()) {
      if (!entry.mtime) {
        await RNFS.unlink(entry.path);
        continue;
      }

      if (entry.mtime < date) {
        await RNFS.unlink(entry.path);
        continue;
      }
    } else if (entry.isDirectory()) {
      await filterFolderOldFiles(entry.path, date);
    }
  }
}
