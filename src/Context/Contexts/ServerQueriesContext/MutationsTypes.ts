import { PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos/Photos';

export type MutationPhotosUploaded = {
  name: 'PhotosUploaded';
  payload: { mediaIds: string[] };
};

export type MutationPhotoDownloaded = {
  name: 'PhotoDownloaded';
  payload: { localPhoto: PhotoLocalType; serverId: string };
};

export type MutationPhotosChangedAll = {
  name: 'PhotosChangedAll';
};

export type Mutation =
  | MutationPhotosUploaded
  | MutationPhotoDownloaded
  | MutationPhotosChangedAll;
