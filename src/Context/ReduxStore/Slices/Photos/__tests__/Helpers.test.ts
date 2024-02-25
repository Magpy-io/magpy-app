import { compareDates, insertPhotoKeyWithOrder } from '../Helpers';
import {
  makeNLocalPhotosWithDifferentDates,
  makePhotosLocalFromPhotosArray,
} from './MockValues';

const dateRecent = '2024-02-03T11:30:40.000Z';
const dateOld = '2024-02-03T11:30:30.000Z';

describe('Tests for compareDates function', () => {
  it('Should return 0 if same date', () => {
    const r = compareDates(dateRecent, dateRecent);
    expect(r).toBe(0);
  });

  it('Should return positive if date1 bigger than date2', () => {
    const r = compareDates(dateRecent, dateOld);
    expect(r).toBeGreaterThan(0);
  });

  it('Should return negative if date1 smaller than date2', () => {
    const r = compareDates(dateOld, dateRecent);
    expect(r).toBeLessThan(0);
  });

  it.each([{ date: 'invalidDate' }, { date: null }, { date: undefined }])(
    'Should return positive if date2 is an invalid',
    testData => {
      const r = compareDates(dateOld, testData.date as string);
      expect(r).toBeGreaterThan(0);
    },
  );

  it.each([{ date: 'invalidDate' }, { date: null }, { date: undefined }])(
    'Should return negative if date1 is an invalid',
    testData => {
      const r = compareDates(testData.date as string, dateOld);
      expect(r).toBeLessThan(0);
    },
  );
});

describe('Tests for insertPhotoKeyWithOrder function', () => {
  it('Should insert photo key in between an older photo and a more recent photo', () => {
    const photos = makeNLocalPhotosWithDifferentDates(3);
    const photosLocal = makePhotosLocalFromPhotosArray(photos);

    const photosLocalIdsOrdered = [photos[0].id, photos[2].id];

    insertPhotoKeyWithOrder(photosLocal, photosLocalIdsOrdered, photos[1]);

    expect(photosLocalIdsOrdered).toEqual(photos.map(photo => photo.id));
  });

  it('Should insert photo key in the begining if it is more recent', () => {
    const photos = makeNLocalPhotosWithDifferentDates(3);
    const photosLocal = makePhotosLocalFromPhotosArray(photos);

    const photosLocalIdsOrdered = [photos[1].id, photos[2].id];

    insertPhotoKeyWithOrder(photosLocal, photosLocalIdsOrdered, photos[0]);

    expect(photosLocalIdsOrdered).toEqual(photos.map(photo => photo.id));
  });

  it('Should insert photo key at the end if it is older', () => {
    const photos = makeNLocalPhotosWithDifferentDates(3);
    const photosLocal = makePhotosLocalFromPhotosArray(photos);

    const photosLocalIdsOrdered = [photos[0].id, photos[1].id];

    insertPhotoKeyWithOrder(photosLocal, photosLocalIdsOrdered, photos[2]);

    expect(photosLocalIdsOrdered).toEqual(photos.map(photo => photo.id));
  });

  it('Should insert photo key just before last if same date as last one', () => {
    const photos = makeNLocalPhotosWithDifferentDates(3);
    photos[2].date = photos[1].date;

    const photosLocal = makePhotosLocalFromPhotosArray(photos);

    const photosLocalIdsOrdered = [photos[0].id, photos[1].id];

    insertPhotoKeyWithOrder(photosLocal, photosLocalIdsOrdered, photos[2]);

    expect(photosLocalIdsOrdered).toEqual([photos[0].id, photos[2].id, photos[1].id]);
  });
});
