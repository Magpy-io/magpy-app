import { RootState } from '../Store';

export function photoLocalSelector(id?: string) {
  return (state: RootState) => (id ? state.photos.photosLocal[id] : undefined);
}

export function photoServerSelector(id?: string) {
  return (state: RootState) => (id ? state.photos.photosServer[id] : undefined);
}
