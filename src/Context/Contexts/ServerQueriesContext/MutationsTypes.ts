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
};

export type Mutation =
  | MutationPhotosUploaded
  | MutationPhotosChanged
  | MutationPhotosChangedAll;
