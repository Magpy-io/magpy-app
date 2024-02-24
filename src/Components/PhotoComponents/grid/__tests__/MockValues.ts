import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
} from '~/Context/ReduxStore/Slices/Photos/Photos';

import { SectionTypePhotoGrid } from '../usePhotosGrouped/Helpers';

export const photoLocal1: PhotoLocalType = {
  id: 'local1',
  fileName: 'photo1.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-03T12:30:00.000Z',
  uri: 'uri1',
  group_name: [],
  type: 'image/jpeg',
};

export const photoLocal2: PhotoLocalType = {
  id: 'local2',
  fileName: 'photo2.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-03T11:45:00.000Z',
  uri: 'uri2',
  group_name: [],
  type: 'image/jpeg',
};

export const photoServer1: PhotoServerType = {
  id: 'server1',
  fileName: 'photo3.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-03T11:00:00.000Z',
  syncDate: '2024-02-03T11:00:00.000Z',
  mediaId: '',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoLocal3: PhotoLocalType = {
  id: 'local3',
  fileName: 'photo4.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-03T10:15:00.000Z',
  uri: 'uri4',
  group_name: [],
  type: 'image/jpeg',
};

export const photoServer2: PhotoServerType = {
  id: 'server2',
  fileName: 'photo5.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-03T09:30:00.000Z',
  syncDate: '2024-02-03T11:00:00.000Z',
  mediaId: '',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoServer3: PhotoServerType = {
  id: 'server3',
  fileName: 'photo6.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-02T12:00:00.000Z',
  syncDate: '2024-02-03T11:00:00.000Z',
  mediaId: '',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoLocal4: PhotoLocalType = {
  id: 'local4',
  fileName: 'photo7.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-02T11:15:00.000Z',
  uri: 'uri7',
  group_name: [],
  type: 'image/jpeg',
};

export const photoLocal5: PhotoLocalType = {
  id: 'local5',
  fileName: 'photo8.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-02T10:30:00.000Z',
  uri: 'uri8',
  group_name: [],
  type: 'image/jpeg',
};

export const photoServer4: PhotoServerType = {
  id: 'server4',
  fileName: 'photo9.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-02T09:45:00.000Z',
  syncDate: '2024-02-03T11:00:00.000Z',
  mediaId: '',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoServer5: PhotoServerType = {
  id: 'server5',
  fileName: 'photo10.jpg',
  fileSize: 0,
  height: 0,
  width: 0,
  date: '2024-02-02T09:00:00.000Z',
  syncDate: '2024-02-03T11:00:00.000Z',
  mediaId: '',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoGallery1: PhotoGalleryType = {
  key: 'local1',
  date: '2024-02-03T12:30:00.000Z',
  mediaId: 'local1',
  serverId: undefined,
};

export const photoGallery2: PhotoGalleryType = {
  key: 'local2',
  date: '2024-02-03T11:45:00.000Z',
  mediaId: 'local2',
  serverId: undefined,
};

export const photoGallery3: PhotoGalleryType = {
  key: 'server1',
  date: '2024-02-03T11:00:00.000Z',
  mediaId: undefined,
  serverId: 'server1',
};

export const photoGallery4: PhotoGalleryType = {
  key: 'local3',
  date: '2024-02-03T10:15:00.000Z',
  mediaId: 'local3',
  serverId: undefined,
};

export const photoGallery5: PhotoGalleryType = {
  key: 'server2',
  date: '2024-02-03T09:30:00.000Z',
  mediaId: undefined,
  serverId: 'server2',
};

export const photoGallery6: PhotoGalleryType = {
  key: 'server3',
  date: '2024-02-02T12:00:00.000Z',
  mediaId: undefined,
  serverId: 'server3',
};

export const photoGallery7: PhotoGalleryType = {
  key: 'local4',
  date: '2024-02-02T11:15:00.000Z',
  mediaId: 'local4',
  serverId: undefined,
};

export const photoGallery8: PhotoGalleryType = {
  key: 'local5',
  date: '2024-02-02T10:30:00.000Z',
  mediaId: 'local5',
  serverId: undefined,
};

export const photoGallery9: PhotoGalleryType = {
  key: 'server4',
  date: '2024-02-02T09:45:00.000Z',
  mediaId: undefined,
  serverId: 'server4',
};

export const photoGallery10: PhotoGalleryType = {
  key: 'server5',
  date: '2024-02-02T09:00:00.000Z',
  mediaId: undefined,
  serverId: 'server5',
};

export const photosGallery: PhotoGalleryType[] = [
  photoGallery1,
  photoGallery2,
  photoGallery3,
  photoGallery4,
  photoGallery5,
  photoGallery6,
  photoGallery7,
  photoGallery8,
  photoGallery9,
  photoGallery10,
];

export const PhotosLocalMock = {
  local1: photoLocal1,
  local2: photoLocal2,
  local3: photoLocal3,
  local4: photoLocal4,
  local5: photoLocal5,
};

export const PhotosServerMock = {
  server1: photoServer1,
  server2: photoServer2,
  server3: photoServer3,
  server4: photoServer4,
  server5: photoServer5,
};

export const PhotosPerDayMock: SectionTypePhotoGrid[] = [
  {
    sectionData: { day: '2024-02-03T00:00:00.000Z', title: 'Feb 3, 2024' },
    data: photosGallery.slice(0, 5),
  },
  {
    sectionData: { day: '2024-02-02T00:00:00.000Z', title: 'Feb 2, 2024' },
    data: photosGallery.slice(5, 10),
  },
];
