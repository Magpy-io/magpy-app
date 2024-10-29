import RNFS from 'react-native-fs';

export async function ClearFolderContent(folderPath: string) {
  const folderExists = await RNFS.exists(folderPath);
  if (!folderExists) {
    return;
  }

  const results = await RNFS.readDir(folderPath);

  for (let i = 0; i < results.length; i++) {
    await RNFS.unlink(results[i].path);
  }
}

export async function DeleteFile(filePath: string) {
  const exists = await RNFS.exists(filePath);

  if (exists) {
    await RNFS.unlink(filePath);
  }
}
