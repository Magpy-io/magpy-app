import { makeGalleryPhoto } from '~/Context/ReduxStore/Slices/Photos/__tests__/MockValues';

import { DateFilterObjectType } from '../DateFilter';
import { StatusFilterObjectType } from '../StatusFilter';
import { filterPhotos } from '../functions';

describe('Tests for function filterPhotos : StatusFilter', () => {
  const inServerFilter: StatusFilterObjectType = {
    type: 'Status',
    params: { value: 'inServer' },
  };
  const inDeviceFilter: StatusFilterObjectType = {
    type: 'Status',
    params: { value: 'inDevice' },
  };
  const devicePhoto = makeGalleryPhoto();
  const serverPhoto = makeGalleryPhoto({ serverId: 'ServerId' });
  serverPhoto.mediaId = undefined;

  it('Should return photos in server if status filter value is inServer ', () => {
    const photos = [devicePhoto, serverPhoto];
    const filteredPhotos = filterPhotos(photos, [inServerFilter]);
    expect(filteredPhotos).toStrictEqual([serverPhoto]);
  });

  it('Should return photos in device if status filter value is inDevice ', () => {
    const photos = [devicePhoto, serverPhoto];
    const filteredPhotos = filterPhotos(photos, [inDeviceFilter]);
    expect(filteredPhotos).toStrictEqual([devicePhoto]);
  });

  it('Should return [] if status filter value is inDevice and no photos are in device ', () => {
    const photos = [serverPhoto];
    const filteredPhotos = filterPhotos(photos, [inDeviceFilter]);
    expect(filteredPhotos).toStrictEqual([]);
  });
});

describe('Tests for function filterPhotos : DateFilter', () => {
  const dateFilter: DateFilterObjectType = {
    type: 'Date',
    params: { fromDate: '2024-01-01T12:30:00.000Z', toDate: '2024-01-05T12:30:00.000Z' },
  };

  const dateInRange = '2024-01-03T12:30:00.000Z';
  const dateNotInRange = '2024-01-06T12:30:00.000Z';

  const photoInRange = makeGalleryPhoto({ date: dateInRange });
  const photoNotInRange = makeGalleryPhoto({ date: dateNotInRange });

  it('Should return the photo in date range', () => {
    const photos = [photoInRange, photoNotInRange];
    const filteredPhotos = filterPhotos(photos, [dateFilter]);
    expect(filteredPhotos).toStrictEqual([photoInRange]);
  });

  it('Should return [] when no photos are in date range', () => {
    const photos = [photoNotInRange];
    const filteredPhotos = filterPhotos(photos, [dateFilter]);
    expect(filteredPhotos).toStrictEqual([]);
  });
});
