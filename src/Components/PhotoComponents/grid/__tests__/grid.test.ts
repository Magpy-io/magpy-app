import {
  getClosestPhotoToIndex,
  getIndexInSectionList,
  getPhotoServerOrLocal,
  getPhotosPerDay,
} from '../Helpers';
import {
  PhotosLocalMock,
  PhotosPerDayMock,
  PhotosServerMock,
  photoLocal1,
  photoServer1,
  photosGallery,
} from './MockValues';

describe('Tests for getClosestPhotoToIndex', () => {
  it('Should return closest to index 0', () => {
    const index = 0;
    const closestPhoto = getClosestPhotoToIndex(index, photosGallery);
    expect(closestPhoto).toStrictEqual({
      key: 'local1',
      mediaId: 'local1',
      serverId: undefined,
    });
  });

  it('Should return closest to index -20', () => {
    const index = -20;
    const closestPhoto = getClosestPhotoToIndex(index, photosGallery);
    expect(closestPhoto).toStrictEqual({
      key: 'local1',
      mediaId: 'local1',
      serverId: undefined,
    });
  });

  it('Should return closest to index 1000', () => {
    const index = 1000;
    const closestPhoto = getClosestPhotoToIndex(index, photosGallery);
    expect(closestPhoto).toStrictEqual({
      key: 'server5',
      mediaId: undefined,
      serverId: 'server5',
    });
  });
});

describe('Tests for getPhotoServerOrLocal', () => {
  it('Should return local photo', () => {
    const photo = {
      key: 'local1',
      mediaId: 'local1',
      serverId: undefined,
    };
    const photoData = getPhotoServerOrLocal(PhotosLocalMock, PhotosServerMock, photo);
    expect(photoData).toBe(photoLocal1);
  });

  it('Should return server photo', () => {
    const photo = {
      key: 'server1',
      mediaId: undefined,
      serverId: 'server1',
    };

    const photoData = getPhotoServerOrLocal(PhotosLocalMock, PhotosServerMock, photo);
    expect(photoData).toBe(photoServer1);
  });

  it('Should throw error', () => {
    const photo = {
      key: 'local1',
      mediaId: 'someUnexistingMediaId',
      serverId: undefined,
    };

    expect(() => getPhotoServerOrLocal(PhotosLocalMock, PhotosServerMock, photo)).toThrow(
      Error,
    );
  });
});

describe('Tests for function getIndexInSectionList', () => {
  it('Should return section position 0', () => {
    const currentPhotoIndex = 0;
    const nbColumns = 3;
    const { sectionIndex, rowIndex } = getIndexInSectionList(
      currentPhotoIndex,
      PhotosPerDayMock,
      PhotosLocalMock,
      PhotosServerMock,
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
      PhotosLocalMock,
      PhotosServerMock,
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
      PhotosLocalMock,
      PhotosServerMock,
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
      PhotosLocalMock,
      PhotosServerMock,
      photosGallery,
      nbColumns,
    );
    expect(sectionIndex).toBe(1);
    expect(rowIndex).toBe(1);
  });
});

it('Should return make me photosPerDay', () => {
  const photosPerDay = getPhotosPerDay(photosGallery, PhotosLocalMock, PhotosServerMock);
  console.log('photosPerDay', photosPerDay);
  expect(photosPerDay).toStrictEqual(PhotosPerDayMock);
});
