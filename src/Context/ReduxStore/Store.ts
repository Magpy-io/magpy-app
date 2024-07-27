import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import GalleryFilters from './Slices/GalleryFilters/GalleryFilters';
import GalleryOptions from './Slices/GalleryOptions/GalleryOptions';
import Photos from './Slices/Photos/Photos';

export const store = configureStore({
  reducer: {
    photos: Photos,
    galleryOptions: GalleryOptions,
    galleryFilters: GalleryFilters,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
