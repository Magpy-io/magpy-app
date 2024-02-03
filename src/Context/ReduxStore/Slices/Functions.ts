import { uniqueDeviceId } from '~/Config/config';
import { APIPhoto } from '~/Helpers/ServerQueries/Types';

import { PhotoServerType } from './Photos';

export function ParseApiPhoto(photo: APIPhoto): PhotoServerType {
  return {
    id: photo.id,
    fileSize: photo.meta.fileSize,
    fileName: photo.meta.name,
    height: photo.meta.height,
    width: photo.meta.width,
    created: photo.meta.date,
    syncDate: photo.meta.syncDate,
    uri: photo.meta.clientPaths.find(clientPath => clientPath.deviceUniqueId == uniqueDeviceId)
      ?.path,
    uriThumbnail: undefined,
    uriCompressed: undefined,
  };
}