import RNFS from 'react-native-fs';
import { v4 as uuidv4 } from 'uuid';

import { ClearFolderContent } from '~/Helpers/FileSystemFunctions';

const WORKER_DATA_INPUT_FOLDER_NAME = 'WorkerDataTmp';

export function getWorkerDataInputFolderPath() {
  return RNFS.ExternalDirectoryPath + '/' + WORKER_DATA_INPUT_FOLDER_NAME;
}

export async function writeWorkerDataInput(photosIds: string[]) {
  const uuid = uuidv4();

  const photosIdsString = photosIds.reduce((prev, photoId) => prev + photoId + '\n', '');

  const workerDataInputFilePath = getWorkerDataInputFolderPath() + `/workerDataInput_${uuid}`;

  await MakeDirWorkerDataInputFolder();
  await RNFS.writeFile(workerDataInputFilePath, photosIdsString);
  return workerDataInputFilePath;
}

async function MakeDirWorkerDataInputFolder() {
  await RNFS.exists(getWorkerDataInputFolderPath());
}

export async function ClearWorkerDataInputFiles() {
  await ClearFolderContent(getWorkerDataInputFolderPath());
}
