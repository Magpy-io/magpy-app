export type InvalidateAllPhotos = {
  name: 'PhotosInvalidateAll';
};

export type InvalidatePhotos = {
  name: 'PhotosInvalidated';
  payload: { serverIds: string[] };
};

export type Invalidation = InvalidateAllPhotos | InvalidatePhotos;
