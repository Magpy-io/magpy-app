import { mergePhotos } from '../Helpers';
import {
  makeLocalPhoto,
  makeNLocalPhotos,
  makeNServerPhotos,
  makePhotosLocalFromPhotosArray,
  makePhotosServerFromPhotosArray,
  makeServerPhoto,
} from './MockValues';

describe('Tests for mergePhotos function', () => {
  it.each([{ n: 1 }, { n: 2 }, { n: 3 }])(
    'Should return an array of gallery photos of $n local photos',
    param => {
      const photosLocalArray = makeNLocalPhotos(param.n, { differentDates: true });
      const photosLocal = makePhotosLocalFromPhotosArray(photosLocalArray);
      const photosLocalIdsOrdered = photosLocalArray.map(photo => photo.id);

      const photosServer = {};
      const photosServerIdsOrdered: string[] = [];

      const galleryPhotos = mergePhotos({
        photosLocal,
        photosLocalIdsOrdered,
        photosServer,
        photosServerIdsOrdered,
      });

      expect(galleryPhotos.length).toBe(param.n);

      galleryPhotos.forEach((galleryPhoto, index) => {
        expect(galleryPhoto.mediaId).toBe(photosLocalArray[index].id);
        expect(galleryPhoto.date).toBe(photosLocalArray[index].date);
        expect(galleryPhoto.serverId).toBeFalsy();
      });
    },
  );

  it.each([{ n: 1 }, { n: 2 }, { n: 3 }])(
    'Should return an array of gallery photos of $n server photos',
    param => {
      const photosServerArray = makeNServerPhotos(param.n, { differentDates: true });
      const photosServer = makePhotosServerFromPhotosArray(photosServerArray);
      const photosServerIdsOrdered = photosServerArray.map(photo => photo.id);

      const photosLocal = {};
      const photosLocalIdsOrdered: string[] = [];

      const galleryPhotos = mergePhotos({
        photosLocal,
        photosLocalIdsOrdered,
        photosServer,
        photosServerIdsOrdered,
      });

      expect(galleryPhotos.length).toBe(param.n);

      galleryPhotos.forEach((galleryPhoto, index) => {
        expect(galleryPhoto.serverId).toBe(photosServerArray[index].id);
        expect(galleryPhoto.date).toBe(photosServerArray[index].date);
        expect(galleryPhoto.mediaId).toBeFalsy();
      });
    },
  );

  it.each([{ n: 1 }, { n: 2 }, { n: 3 }])(
    'Should return an array of gallery photos of $n merged photos',
    param => {
      const photosLocalArray = makeNLocalPhotos(param.n, { differentDates: true });
      const photosLocal = makePhotosLocalFromPhotosArray(photosLocalArray);
      const photosLocalIdsOrdered = photosLocalArray.map(photo => photo.id);

      const photosServerArray = makeNServerPhotos(param.n, { differentDates: true });
      const photosServer = makePhotosServerFromPhotosArray(photosServerArray);
      const photosServerIdsOrdered = photosServerArray.map(photo => photo.id);

      photosServerArray.forEach((photoServer, index) => {
        photoServer.mediaId = photosLocalArray[index].id;
      });

      const galleryPhotos = mergePhotos({
        photosLocal,
        photosLocalIdsOrdered,
        photosServer,
        photosServerIdsOrdered,
      });

      expect(galleryPhotos.length).toBe(param.n);

      galleryPhotos.forEach((galleryPhoto, index) => {
        expect(galleryPhoto.serverId).toBe(photosServerArray[index].id);
        expect(galleryPhoto.mediaId).toBe(photosLocalArray[index].id);
        expect(galleryPhoto.date).toBe(photosServerArray[index].date);
      });
    },
  );

  it('Should work when return an array of gallery photos of a local and then a server photo', () => {
    const localPhoto = makeLocalPhoto({ date: '2024-01-01T12:01:00.000Z' });
    const photosLocal = makePhotosLocalFromPhotosArray([localPhoto]);
    const photosLocalIdsOrdered = [localPhoto.id];

    const serverPhoto = makeServerPhoto({ date: '2024-01-01T12:00:00.000Z' });
    const photosServer = makePhotosServerFromPhotosArray([serverPhoto]);
    const photosServerIdsOrdered = [serverPhoto.id];

    const galleryPhotos = mergePhotos({
      photosLocal,
      photosLocalIdsOrdered,
      photosServer,
      photosServerIdsOrdered,
    });

    expect(galleryPhotos.length).toBe(2);

    expect(galleryPhotos[0].mediaId).toBe(localPhoto.id);
    expect(galleryPhotos[0].serverId).toBeFalsy();

    expect(galleryPhotos[1].serverId).toBe(serverPhoto.id);
    expect(galleryPhotos[1].mediaId).toBeFalsy();
  });

  it('Should work when return an array of gallery photos of a local and then a merged photo', () => {
    const photosLocalArray = makeNLocalPhotos(2, { differentDates: true });
    const photosLocal = makePhotosLocalFromPhotosArray(photosLocalArray);
    const photosLocalIdsOrdered = photosLocalArray.map(photo => photo.id);

    const serverPhoto = makeServerPhoto();
    serverPhoto.mediaId = photosLocalArray[1].id;
    serverPhoto.date = photosLocalArray[1].date;
    const photosServer = makePhotosServerFromPhotosArray([serverPhoto]);
    const photosServerIdsOrdered = [serverPhoto.id];

    const galleryPhotos = mergePhotos({
      photosLocal,
      photosLocalIdsOrdered,
      photosServer,
      photosServerIdsOrdered,
    });

    expect(galleryPhotos.length).toBe(2);

    expect(galleryPhotos[0].mediaId).toBe(photosLocalArray[0].id);
    expect(galleryPhotos[0].serverId).toBeFalsy();

    expect(galleryPhotos[1].serverId).toBe(serverPhoto.id);
    expect(galleryPhotos[1].mediaId).toBe(photosLocalArray[1].id);
  });

  it('Should return merged photo with server photo when server and local photo do not have same date', () => {
    const photo1Local = makeLocalPhoto({
      mediaId: 'mediaId1',
      date: '2024-01-01T12:01:00.000Z',
    });
    const photo2Local = makeLocalPhoto({
      mediaId: 'mediaId2',
      date: '2024-01-01T12:00:00.000Z',
    });
    const photosLocal = makePhotosLocalFromPhotosArray([photo1Local, photo2Local]);
    const photosLocalIdsOrdered = [photo1Local.id, photo2Local.id];

    const serverPhoto = makeServerPhoto({ date: '2024-01-01T12:02:00.000Z' });
    serverPhoto.mediaId = photo2Local.id;
    const photosServer = makePhotosServerFromPhotosArray([serverPhoto]);
    const photosServerIdsOrdered = [serverPhoto.id];

    const galleryPhotos = mergePhotos({
      photosLocal,
      photosLocalIdsOrdered,
      photosServer,
      photosServerIdsOrdered,
    });

    expect(galleryPhotos.length).toBe(2);

    expect(galleryPhotos[0].serverId).toBe(serverPhoto.id);
    expect(galleryPhotos[0].mediaId).toBe(photo2Local.id);
    expect(galleryPhotos[0].date).toBe(serverPhoto.date);

    expect(galleryPhotos[1].serverId).toBeFalsy();
    expect(galleryPhotos[1].mediaId).toBe(photo1Local.id);
  });
});
