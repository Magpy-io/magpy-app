export type MutationPhotosChangedAll = {
  name: 'PhotosChangedAll';
};

export type InvalidatePhotos = {
  name: 'PhotosInvalidated';
  payload: { serverIds: string[] };
};

export type Mutation = MutationPhotosChangedAll | InvalidatePhotos;
