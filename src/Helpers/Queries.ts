import { GetPhotoPartById } from '~/Helpers/ServerQueries';

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
