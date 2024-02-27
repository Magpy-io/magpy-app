import { makeGalleryPhoto } from '~/Context/ReduxStore/Slices/Photos/__tests__/MockValues';

import { DateFilter } from '../DateFilter';
import { StatusFilter } from '../StatusFilter';

describe('Tests for function filterPhotos : StatusFilter', () => {
  const inServerFilter = new StatusFilter({ value: 'inServer' });
  const inDeviceFilter = new StatusFilter({ value: 'inDevice' });

  const devicePhoto = makeGalleryPhoto();
  const serverPhoto = makeGalleryPhoto({ serverId: 'ServerId' });
  serverPhoto.mediaId = undefined;

  it('Should return photos in server if status filter value is inServer ', () => {
    const photos = [devicePhoto, serverPhoto];
    const filteredPhotos = inServerFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([serverPhoto]);
  });

  it('Should return photos in device if status filter value is inDevice ', () => {
    const photos = [devicePhoto, serverPhoto];
    const filteredPhotos = inDeviceFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([devicePhoto]);
  });

  it('Should return [] if status filter value is inDevice and no photos are in device ', () => {
    const photos = [serverPhoto];
    const filteredPhotos = inDeviceFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([]);
  });
});

describe('Tests for function filterPhotos : DateFilter', () => {
  const dateFilter = new DateFilter({
    fromDate: '2024-01-01T12:30:00.000Z',
    toDate: '2024-01-05T12:30:00.000Z',
  });

  const dateInRange = '2024-01-03T12:30:00.000Z';
  const dateNotInRange = '2024-01-06T12:30:00.000Z';
  const photoInRange = makeGalleryPhoto({ date: dateInRange });
  const photoNotInRange = makeGalleryPhoto({ date: dateNotInRange });

  it('Should return the photo in date range', () => {
    const photos = [photoInRange, photoNotInRange];
    const filteredPhotos = dateFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([photoInRange]);
  });

  it('Should return [] when no photos are in date range', () => {
    const photos = [photoNotInRange];
    const filteredPhotos = dateFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([]);
  });
});
