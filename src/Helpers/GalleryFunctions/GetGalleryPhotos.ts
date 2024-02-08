import { NativeModules } from 'react-native';

import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import { PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos';

const { MainModule } = NativeModules;

export async function GalleryGetPhotos(
  n: number,
  offset: number = 0,
): Promise<PhotoLocalType[]> {
  const result = await CameraRoll.getPhotos({
    first: n,
    after: String(offset),
    assetType: 'Photos',
    include: ['fileSize', 'filename', 'imageSize', 'albums'],
  });

  // Need to be sorted because CameraRoll sorts them by DATE_ADDED, but the timestamp value comes
  // from DATE_TAKEN if available (exif date), and if not then from DATE_ADDED

  result.edges.sort((a, b) => {
    return b.node.timestamp - a.node.timestamp;
  });

  return result.edges.map(edge => {
    return {
      id: edge.node.id,
      uri: edge.node.image.uri,
      fileSize: edge.node.image.fileSize ?? 0,
      fileName: edge.node.image.filename ?? '',
      height: edge.node.image.height,
      width: edge.node.image.width,
      group_name: edge.node.group_name,
      created: new Date(Math.floor(edge.node.timestamp) * 1000).toISOString(),
      modified: new Date(Math.floor(edge.node.modificationTimestamp) * 1000).toISOString(),
      type: edge.node.type,
    };
  });
}

export async function getPhotoFromDevice(mediaId: string): Promise<PhotoLocalType> {
  const photo = await MainModule.getPhotoById(mediaId);

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
