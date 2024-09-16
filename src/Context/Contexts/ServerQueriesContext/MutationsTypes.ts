export type MutationPhotosUploaded = {
  name: 'PhotosUploaded';
  payload: { mediaIds: string[] };
};

export type MutationPhotosChanged = {
  name: 'PhotosChanged';
  payload: { serverIds: string[] };
};

export type MutationPhotosChangedAll = {
  name: 'PhotosChangedAll';
  payload: null;
};

export type Mutation =
  | MutationPhotosUploaded
  | MutationPhotosChanged
  | MutationPhotosChangedAll;
