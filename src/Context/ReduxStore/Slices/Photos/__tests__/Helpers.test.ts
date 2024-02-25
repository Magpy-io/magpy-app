import { insertPhotoKeyWithOrder } from '../Helpers';
import { makeNLocalPhotos, makePhotosLocalFromPhotosArray } from './MockValues';

describe('Tests for insertPhotoKeyWithOrder function', () => {
  it('Should insert photo key in between an older photo and a more recent photo', () => {
    const photos = makeNLocalPhotos(3, { differentDates: true });
    const photosLocal = makePhotosLocalFromPhotosArray(photos);

    const photosLocalIdsOrdered = [photos[0].id, photos[2].id];

    insertPhotoKeyWithOrder(photosLocal, photosLocalIdsOrdered, photos[1]);

    expect(photosLocalIdsOrdered).toEqual(photos.map(photo => photo.id));
  });

  it('Should insert photo key in the begining if it is more recent', () => {
    const photos = makeNLocalPhotos(3, { differentDates: true });
    const photosLocal = makePhotosLocalFromPhotosArray(photos);

    const photosLocalIdsOrdered = [photos[1].id, photos[2].id];

    insertPhotoKeyWithOrder(photosLocal, photosLocalIdsOrdered, photos[0]);

    expect(photosLocalIdsOrdered).toEqual(photos.map(photo => photo.id));
  });

  it('Should insert photo key at the end if it is older', () => {
    const photos = makeNLocalPhotos(3, { differentDates: true });
    const photosLocal = makePhotosLocalFromPhotosArray(photos);

    const photosLocalIdsOrdered = [photos[0].id, photos[1].id];

    insertPhotoKeyWithOrder(photosLocal, photosLocalIdsOrdered, photos[2]);

    expect(photosLocalIdsOrdered).toEqual(photos.map(photo => photo.id));
  });

  it('Should insert photo key just before last if same date as last one', () => {
    const photos = makeNLocalPhotos(3, { differentDates: true });
    photos[2].date = photos[1].date;

    const photosLocal = makePhotosLocalFromPhotosArray(photos);

    const photosLocalIdsOrdered = [photos[0].id, photos[1].id];

    insertPhotoKeyWithOrder(photosLocal, photosLocalIdsOrdered, photos[2]);

    expect(photosLocalIdsOrdered).toEqual([photos[0].id, photos[2].id, photos[1].id]);
  });
});

describe('Tests for mergePhotos function', () => {});
