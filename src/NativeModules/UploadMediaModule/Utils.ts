import RNFS from 'react-native-fs';
import { v4 as uuidv4 } from 'uuid';

const WORKER_DATA_INPUT_FOLDER_NAME = 'WorkerDataTmp';

export function getWorkerDataInputFolderPath() {
  return RNFS.ExternalDirectoryPath + '/' + WORKER_DATA_INPUT_FOLDER_NAME;
}

export async function writeWorkerDataInput(photosIds: string[]) {
  const uuid = uuidv4();

  const photosIdsString = photosIds.reduce((prev, photoId) => prev + photoId + '\n', '');

  const workerDataInputFilePath = getWorkerDataInputFolderPath() + `/workerDataInput_${uuid}`;

  await WorkerDataInputFolderExists();
  await RNFS.writeFile(workerDataInputFilePath, photosIdsString);
  return workerDataInputFilePath;
}

export async function WorkerDataInputFolderExists() {
  const exists = await RNFS.exists(getWorkerDataInputFolderPath());

  if (!exists) {
    await RNFS.mkdir(getWorkerDataInputFolderPath());
  }
}
