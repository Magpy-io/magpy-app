export type InvalidateAllPhotos = {
  name: 'PhotosInvalidateAll';
};

export type InvalidatePhotos = {
  name: 'PhotosInvalidated';
  payload: { serverIds: string[] };
};

export type InvalidatePhotosByMediaId = {
  name: 'PhotosInvalidatedByMediaId';
  payload: { mediaIds: string[] };
};

export type Invalidation = InvalidateAllPhotos | InvalidatePhotos | InvalidatePhotosByMediaId;
