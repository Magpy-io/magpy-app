export const serverId1 = 'serverId1';
export const serverId2 = 'serverId2';
export const serverId3 = 'serverId3';

export const mediaId1 = 'mediaId1';
export const mediaId2 = 'mediaId2';
export const mediaId3 = 'mediaId3';

const uri1 = 'uri1';
const uri2 = 'uri2';
const uri3 = 'uri3';

const date1 = '2024-01-01T10:00:00.000Z';
const date2 = '2024-01-01T09:00:00.000Z';
const date3 = '2024-01-01T08:00:00.000Z';

const fileSize = 3415968;
const height = 3840;
const width = 2160;

export const photo1 = {
  key: serverId1,
  mediaId: mediaId1,
  serverId: serverId1,
};

export const photoServer1 = {
  id: serverId1,
  fileName: 'photo1.jpg',
  fileSize,
  height,
  width,
  syncDate: '2024-02-02T00:00:00.000Z',
  created: date1,
  uri: uri1,
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoServer2 = {
  id: serverId2,
  fileName: 'photo2.jpg',
  fileSize,
  height,
  width,
  syncDate: '2024-02-02T00:00:00.000Z',
  created: date2,
  uri: uri2,
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoServer3 = {
  id: serverId3,
  fileName: 'photo3.jpg',
  fileSize,
  height,
  width,
  syncDate: '2024-02-02T00:00:00.000Z',
  created: date3,
  uri: uri3,
  uriCompressed: undefined,
  uriThumbnail: undefined,
};

export const photoLocal1 = {
  id: mediaId1,
  fileName: 'photo1.jpg',
  fileSize,
  height,
  width,
  created: date1,
  uri: uri1,
  group_name: [],
  type: 'image/jpeg',
};

export const photoLocal2 = {
  id: mediaId2,
  fileName: 'photo2.jpg',
  fileSize,
  height,
  width,
  created: date2,
  uri: uri2,
  group_name: [],
  type: 'image/jpeg',
};

export const photoLocal3 = {
  id: mediaId3,
  fileName: 'photo3.jpg',
  fileSize,
  height,
  width,
  created: date3,
  uri: uri3,
  group_name: [],
  type: 'image/jpeg',
};

export const photosLocal = {
  [mediaId1]: photoLocal1,
  [mediaId2]: photoLocal2,
  [mediaId3]: photoLocal3,
};

export const photosLocalIdsOrdered = [mediaId1, mediaId2, mediaId3];

export const photosServer = {
  [serverId1]: photoServer1,
  [serverId2]: photoServer2,
  [serverId3]: photoServer3,
};

export const photosServerIdsOrdered = [serverId1, serverId2, serverId3];

export function DeepCopy(o: object) {
  return JSON.parse(JSON.stringify(o)) as object;
}
