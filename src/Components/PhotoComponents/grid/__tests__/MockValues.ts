export const photoLocal1 = {
  id: 'local1',
  fileName: 'photo1.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-03T12:30:00.000Z',
  created: '2024-02-03T12:30:00.000Z',
  uri: 'uri1',
  group_name: [],
  type: 'image/jpeg',
};

export const photoLocal2 = {
  id: 'local2',
  fileName: 'photo2.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-03T11:45:00.000Z',
  created: '2024-02-03T11:45:00.000Z',
  uri: 'uri2',
  group_name: [],
  type: 'image/jpeg',
};

export const photoServer1 = {
  id: 'server1',
  fileName: 'photo3.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-03T11:00:00.000Z',
  created: '2024-02-03T11:00:00.000Z',
  uri: 'uri3',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoLocal3 = {
  id: 'local3',
  fileName: 'photo4.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-03T10:15:00.000Z',
  created: '2024-02-03T10:15:00.000Z',
  uri: 'uri4',
  group_name: [],
  type: 'image/jpeg',
};

export const photoServer2 = {
  id: 'server2',
  fileName: 'photo5.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-03T09:30:00.000Z',
  created: '2024-02-03T09:30:00.000Z',
  uri: 'uri5',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoServer3 = {
  id: 'server3',
  fileName: 'photo6.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-02T12:00:00.000Z',
  created: '2024-02-02T12:00:00.000Z',
  uri: 'uri6',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoLocal4 = {
  id: 'local4',
  fileName: 'photo7.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-02T11:15:00.000Z',
  created: '2024-02-02T11:15:00.000Z',
  uri: 'uri7',
  group_name: [],
  type: 'image/jpeg',
};

export const photoLocal5 = {
  id: 'local5',
  fileName: 'photo8.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-02T10:30:00.000Z',
  created: '2024-02-02T10:30:00.000Z',
  uri: 'uri8',
  group_name: [],
  type: 'image/jpeg',
};

export const photoServer4 = {
  id: 'server4',
  fileName: 'photo9.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-02T09:45:00.000Z',
  created: '2024-02-02T09:45:00.000Z',
  uri: 'uri9',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoServer5 = {
  id: 'server5',
  fileName: 'photo10.jpg',
  fileSize: undefined,
  height: undefined,
  width: undefined,
  modified: '2024-02-02T09:00:00.000Z',
  created: '2024-02-02T09:00:00.000Z',
  uri: 'uri10',
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoGallery1 = {
  key: 'local1',
  mediaId: 'local1',
  serverId: undefined,
};

export const photoGallery2 = {
  key: 'local2',
  mediaId: 'local2',
  serverId: undefined,
};

export const photoGallery3 = {
  key: 'server1',
  mediaId: undefined,
  serverId: 'server1',
};

export const photoGallery4 = {
  key: 'local3',
  mediaId: 'local3',
  serverId: undefined,
};

export const photoGallery5 = {
  key: 'server2',
  mediaId: undefined,
  serverId: 'server2',
};

export const photoGallery6 = {
  key: 'server3',
  mediaId: undefined,
  serverId: 'server3',
};

export const photoGallery7 = {
  key: 'local4',
  mediaId: 'local4',
  serverId: undefined,
};

export const photoGallery8 = {
  key: 'local5',
  mediaId: 'local5',
  serverId: undefined,
};

export const photoGallery9 = {
  key: 'server4',
  mediaId: undefined,
  serverId: 'server4',
};

export const photoGallery10 = {
  key: 'server5',
  mediaId: undefined,
  serverId: 'server5',
};

export const photosGallery = [
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

export const PhotosPerDayMock = [
  {
    day: '2024-02-03T00:00:00.000Z',
    title: '2024-02-03T00:00:00.000Z',
    data: photosGallery.slice(0, 5),
  },
  {
    day: '2024-02-02T00:00:00.000Z',
    title: '2024-02-02T00:00:00.000Z',
    data: photosGallery.slice(5, 10),
  },
];
