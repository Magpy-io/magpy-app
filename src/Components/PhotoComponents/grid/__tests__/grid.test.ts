import { getIndexInSectionList, getPhotosPerDay } from '../Helpers';
import { PhotosPerDayMock, photosGallery } from './MockValues';

describe('Tests for function getIndexInSectionList', () => {
  it('Should return section position 0', () => {
    const currentPhotoIndex = 0;
    const nbColumns = 3;
    const { sectionIndex, rowIndex } = getIndexInSectionList(
      currentPhotoIndex,
      PhotosPerDayMock,
      photosGallery,
      nbColumns,
    );
    expect(sectionIndex).toBe(0);
    expect(rowIndex).toBe(0);
  });

  it('Should return section position', () => {
    const currentPhotoIndex = 7;
    const nbColumns = 3;
    const { sectionIndex, rowIndex } = getIndexInSectionList(
      currentPhotoIndex,
      PhotosPerDayMock,
      photosGallery,
      nbColumns,
    );
    expect(sectionIndex).toBe(1);
    expect(rowIndex).toBe(0);
  });

  it('Should return section position 0', () => {
    const currentPhotoIndex = -20;
    const nbColumns = 3;
    const { sectionIndex, rowIndex } = getIndexInSectionList(
      currentPhotoIndex,
      PhotosPerDayMock,
      photosGallery,
      nbColumns,
    );
    expect(sectionIndex).toBe(0);
    expect(rowIndex).toBe(0);
  });

  it('Should return section last position', () => {
    const currentPhotoIndex = 1000;
    const nbColumns = 3;
    const { sectionIndex, rowIndex } = getIndexInSectionList(
      currentPhotoIndex,
      PhotosPerDayMock,
      photosGallery,
      nbColumns,
    );
    expect(sectionIndex).toBe(1);
    expect(rowIndex).toBe(1);
  });
});

it('Should return make me photosPerDay', () => {
  const photosPerDay = getPhotosPerDay(photosGallery);
  console.log('photosPerDay', photosPerDay);
  expect(photosPerDay).toStrictEqual(PhotosPerDayMock);
});
