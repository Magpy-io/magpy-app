import { getIndexInSectionList, getPhotosPerDay } from '../usePhotosGrouped/Helpers';
import { PhotosPerDayMock, photosGallery } from './MockValues';

describe('Tests for function getIndexInSectionList with 2 sections of 5 items each', () => {
  it('Should return section 0 and itemIndex 0 when passing first photo', () => {
    const currentPhotoIndex = 0;
    const currentPhoto = photosGallery[currentPhotoIndex];

    const { sectionIndex, itemIndex } = getIndexInSectionList(currentPhoto, PhotosPerDayMock);
    expect(sectionIndex).toBe(0);
    expect(itemIndex).toBe(0);
  });

  it('Should return sectionIndex 1 and itemIndex 2 when passing 7th photo', () => {
    const currentPhotoIndex = 7;
    const currentPhoto = photosGallery[currentPhotoIndex];
    const { sectionIndex, itemIndex } = getIndexInSectionList(currentPhoto, PhotosPerDayMock);
    expect(sectionIndex).toBe(1);
    expect(itemIndex).toBe(2);
  });

  it('Should return sectionIndex -1 when photo section not found', () => {
    const newPhoto = {
      key: 'server',
      date: '0000-01-01T00:00:00.000Z',
      mediaId: undefined,
      serverId: 'server',
    };
    const { sectionIndex } = getIndexInSectionList(newPhoto, PhotosPerDayMock);
    expect(sectionIndex).toBe(-1);
  });

  it('Should return sectionIndex 0 and itemIndex -1 when photo section is found but does not exist in the section', () => {
    const newPhoto = {
      key: 'server',
      date: '2024-02-03T00:00:00.000Z',
      mediaId: undefined,
      serverId: 'server',
    };
    const { sectionIndex, itemIndex } = getIndexInSectionList(newPhoto, PhotosPerDayMock);
    expect(sectionIndex).toBe(0);
    expect(itemIndex).toBe(-1);
  });
});

it('Should make me photosPerDay', () => {
  const photosPerDay = getPhotosPerDay(photosGallery);
  expect(photosPerDay).toStrictEqual(PhotosPerDayMock);
});
