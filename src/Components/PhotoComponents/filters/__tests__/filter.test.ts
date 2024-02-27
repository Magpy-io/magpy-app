import { makeGalleryPhoto } from '~/Context/ReduxStore/Slices/Photos/__tests__/MockValues';

import { DateFilter } from '../DateFilter';
import { StatusFilter } from '../StatusFilter';

describe('Tests for StatusFilter class', () => {
  const inServerFilter = new StatusFilter({ value: 'inServer' });
  const inDeviceFilter = new StatusFilter({ value: 'inDevice' });

  const devicePhoto = makeGalleryPhoto();
  const serverPhoto = makeGalleryPhoto({ serverId: 'ServerId' });
  serverPhoto.mediaId = undefined;

  it('Should return only the photo in server when passed two photos : one in server, one in device', () => {
    const photos = [devicePhoto, serverPhoto];
    const filteredPhotos = inServerFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([serverPhoto]);
  });

  it('Should return only the photo in device when passed two photos : one in server, one in device', () => {
    const photos = [devicePhoto, serverPhoto];
    const filteredPhotos = inDeviceFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([devicePhoto]);
  });

  it('Should return [] if passed only one server photo', () => {
    const photos = [serverPhoto];
    const filteredPhotos = inDeviceFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([]);
  });
});

describe('Tests DateFilter class', () => {
  const dateFilter = new DateFilter({
    fromDate: '2024-01-01T12:30:00.000Z',
    toDate: '2024-01-05T12:30:00.000Z',
  });

  const dateInRange = '2024-01-03T12:30:00.000Z';
  const dateNotInRange = '2024-01-06T12:30:00.000Z';
  const photoInRange = makeGalleryPhoto({ date: dateInRange });
  const photoNotInRange = makeGalleryPhoto({ date: dateNotInRange });

  it('Should return the photo in date range when passed two photos : one in date range, one not in date range', () => {
    const photos = [photoInRange, photoNotInRange];
    const filteredPhotos = dateFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([photoInRange]);
  });

  it('Should return [] when passed one photo not in date range', () => {
    const photos = [photoNotInRange];
    const filteredPhotos = dateFilter.filter(photos);
    expect(filteredPhotos).toStrictEqual([]);
  });
});
