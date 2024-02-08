import { uniqueDeviceId } from '~/Config/config';
import { APIPhoto } from '~/Helpers/ServerQueries/Types';
import { LocalPhotoById } from '~/NativeModules/extendNativeModulesType';

import { PhotoLocalType, PhotoServerType } from './Photos';

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

export function ParseGetPhotoByIdLocal(photo: LocalPhotoById): PhotoLocalType {
  return {
    id: photo.id,
    uri: photo.uri,
    fileSize: photo.fileSize,
    fileName: photo.filename,
    height: photo.height,
    width: photo.width,
    group_name: photo.group_name,
    created: new Date(Math.floor(photo.timestamp) * 1000).toISOString(),
    modified: new Date(Math.floor(photo.modificationTimestamp) * 1000).toISOString(),
    type: photo.type,
  };
}
