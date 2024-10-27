import RNFS from 'react-native-fs';

const DAYS_TO_DELETE_LOGS = 7;

export async function FilterOldLogFiles() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_DELETE_LOGS);

  await filterFolderOldFiles(RNFS.ExternalDirectoryPath + '/logs', cutoffDate);
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
