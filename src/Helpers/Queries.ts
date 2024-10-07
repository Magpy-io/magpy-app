import { uniqueDeviceId } from '~/Config/config';
import { AddPhotoInit, AddPhotoPart, GetPhotoPartById } from '~/Helpers/ServerQueries';

import { RangeSplitterLinear } from './RangeSplitter';
import { GetPhotos } from './ServerQueries';
import { APIPhoto } from './ServerQueries/Types';

export async function getPhotoWithProgress(
  id: string,
  f?: (progess: number, total: number) => void,
) {
  const response = await GetPhotoPartById.Post({ id: id, part: 0 });

  if (!response.ok) {
    return response;
  }
  const totalNbParts = response.data.totalNbOfParts;

  f?.(0, totalNbParts);

  const image64Parts = [response.data.photo.image64];

  let responseI: GetPhotoPartById.ResponseType;
  for (let i = 1; i < totalNbParts; i++) {
    responseI = await GetPhotoPartById.Post({ id: id, part: i });

    if (!responseI.ok) {
      return responseI;
    }

    image64Parts.push(responseI.data.photo.image64);

    f?.(i, totalNbParts);
  }
  response.data.photo.image64 = image64Parts.join('');
  return response;
}

export async function addPhotoWithProgress(
  photo: {
    date: string;
    fileSize: number;
    height: number;
    name: string;
    mediaId: string;
    width: number;
    image64: string;
  },
  f?: (progess: number, total: number) => void,
): Promise<APIPhoto> {
  const base64Image = photo.image64;

  const base64ImageSplit = splitString(base64Image);

  const response = await AddPhotoInit.Post({
    name: photo.name,
    fileSize: photo.fileSize,
    width: photo.width,
    height: photo.height,
    date: photo.date,
    mediaId: photo.mediaId,
    image64Len: base64Image.length,
    deviceUniqueId: uniqueDeviceId,
  });

  if (!response.ok) {
    throw new Error(response.errorCode);
  }

  if (response.data.photoExistsBefore) {
    return response.data.photo;
  }

  const id = response.data.id;

  let responseI;
  for (let i = 0; i < base64ImageSplit.length; i++) {
    responseI = await AddPhotoPart.Post({
      id: id,
      partNumber: i,
      partSize: base64ImageSplit[i].length,
      photoPart: base64ImageSplit[i],
    });

    if (!responseI.ok) {
      throw new Error(responseI.errorCode);
    }

    f?.(i, base64ImageSplit.length);
  }

  if (!responseI?.data.done) {
    throw new Error('Sent all parts but photo transfer not done.');
  }

  return responseI.data.photo;
}

function splitString(str: string) {
  return new RangeSplitterLinear(100000)
    .splitRange(str.length)
    .map(range => str.substring(range.start, range.end));
}

export async function getPhotosBatched({
  number,
  offset,
  photoType,
}: GetPhotos.RequestData): Promise<GetPhotos.ResponseType> {
  const BATCH_SIZE = 500;

  let photosLeft = number;
  let endReached = false;
  const photos: APIPhoto[] = [];
  let warning = false;

  while (photosLeft > 0 && !endReached) {
    const ret: GetPhotos.ResponseType = await GetPhotos.Post({
      number: photosLeft > BATCH_SIZE ? BATCH_SIZE : photosLeft,
      offset: offset + photos.length,
      photoType,
    });

    if (!ret.ok) {
      return ret;
    }

    warning ||= ret.warning;
    endReached = ret.data.endReached;
    photos.push(...ret.data.photos);

    photosLeft -= BATCH_SIZE;
  }

  return { ok: true, data: { endReached, photos, number: photos.length }, warning };
}
