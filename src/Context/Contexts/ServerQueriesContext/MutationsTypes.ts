export type MutationPhotosUploaded = {
  name: 'PhotosUploaded';
  payload: { mediaIds: string[] };
};

export type MutationPhotosChangedAll = {
  name: 'PhotosChangedAll';
};

export type InvalidatePhotos = {
  name: 'PhotosInvalidated';
  payload: { serverIds: string[] };
};

export type Mutation = MutationPhotosUploaded | MutationPhotosChangedAll | InvalidatePhotos;
