import { PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { MediaManagementModule, PhotoIdentifier } from '~/NativeModules/MediaManagementModule';

export async function GalleryGetPhotos(
  n: number,
  offset: number = 0,
): Promise<PhotoLocalType[]> {
  const result = await MediaManagementModule.getPhotos({
    first: n,
    after: String(offset),
    assetType: 'Photos',
    include: ['fileSize', 'filename', 'imageSize', 'albums'],
    mimeTypes: ['image/jpeg', 'image/png'],
  });

  // Need to be sorted because CameraRoll sorts them by DATE_ADDED, but the timestamp value comes
  // from DATE_TAKEN if available (exif date), and if not then from DATE_ADDED

  result.edges.sort((a, b) => {
    return b.node.timestamp - a.node.timestamp;
  });

  return result.edges.map(parsePhotoIdentifierToPhotoLocalType);
}

export async function getPhotoFromDevice(mediaId: string): Promise<PhotoLocalType | null> {
  const result = await MediaManagementModule.getPhotoById(mediaId, {
    first: 0,
    assetType: 'Photos',
    include: ['fileSize', 'filename', 'imageSize', 'albums'],
  });

  if (result.edges.length == 0) {
    return null;
  }

  if (result.edges.length > 1) {
    throw new Error('getPhotoFromDevice: found more than one photo with same mediaId');
  }

  return parsePhotoIdentifierToPhotoLocalType(result.edges[0]);
}

export function parsePhotoIdentifierToPhotoLocalType(edge: PhotoIdentifier) {
  const timestamp = getCorrectDate(edge.node) * 1000;

  return {
    id: edge.node.id,
    uri: edge.node.image.uri,
    fileSize: edge.node.image.fileSize ?? 0,
    fileName: edge.node.image.filename ?? '',
    height: edge.node.image.height,
    width: edge.node.image.width,
    group_name: edge.node.group_name,
    date: new Date(timestamp).toISOString(),
    type: edge.node.type,
  };
}

// timestamp is obtained from either DATE_TAKEN if available or DATE_ADDED if not from the MediaStore
// modificationTimestamp is obtained from DATE_MODIFIED from the MediaStore
//
// We get the minimum of the two so that if we got the date from DATE_TAKEN we use it,
// if not DATE_MODIFIED will be a better choice than DATE_ADDED
// because in case of moving the photo from one path to another or between albums
// the image file will be moved and a new DATE_ADDED will be set but DATE_MODIFIED
// won't change and it will be older than DATE_ADDED

function getCorrectDate(photo: { timestamp: number; modificationTimestamp: number }): number {
  return Math.min(photo.timestamp, photo.modificationTimestamp);
}
