import React, { ReactNode, createContext, useContext, useState } from 'react';

import { FilterObjectType } from '~/Components/PhotoComponents/filters/Filter';

import {
  addGalleryFilters,
  addServerFilters,
  removeGalleryFilter,
  removeServerFilter,
} from '../ReduxStore/Slices/GalleryFilters/GalleryFilters';
import { FiltersSelector } from '../ReduxStore/Slices/GalleryFilters/Selectors';
import { PhotoGalleryType } from '../ReduxStore/Slices/Photos/Photos';
import {
  photosGallerySelector,
  serverGalleryPhotosSelector,
} from '../ReduxStore/Slices/Photos/Selectors';
import { useAppDispatch, useAppSelector } from '../ReduxStore/Store';

export type PhotoGalleryContextType = {
  isServer: boolean;
  setIsServer: React.Dispatch<React.SetStateAction<boolean>>;
  photos: PhotoGalleryType[];
  filters: FilterObjectType[];
  addFilters: (filters: FilterObjectType[]) => void;
  removeFilter: (filter: FilterObjectType) => void;
};

const PhotoGalleryContext = createContext<PhotoGalleryContextType | undefined>(undefined);

type PropsType = {
  isServer: boolean;
  children: ReactNode;
};

const PhotoGalleryContextProvider: React.FC<PropsType> = props => {
  const [isServer, setIsServer] = useState(props.isServer);
  const dispatch = useAppDispatch();

  const { serverFilters, filters } = useAppSelector(FiltersSelector);
  const galleryPhotos = useAppSelector(photosGallerySelector);
  const serverPhotos = useAppSelector(serverGalleryPhotosSelector);

  const removeFilter = (filter: FilterObjectType) => {
    isServer
      ? dispatch(removeServerFilter({ filter }))
      : dispatch(removeGalleryFilter({ filter }));
  };
  const addFilters = (filters: FilterObjectType[]) => {
    isServer
      ? dispatch(addServerFilters({ filters }))
      : dispatch(addGalleryFilters({ filters }));
  };

  const value = {
    isServer: isServer,
    setIsServer: setIsServer,
    filters: isServer ? serverFilters : filters,
    addFilters: addFilters,
    removeFilter: removeFilter,
    photos: isServer ? serverPhotos : galleryPhotos,
  };

  return (
    <PhotoGalleryContext.Provider value={value}>{props.children}</PhotoGalleryContext.Provider>
  );
};

function usePhotoGalleryContext(): PhotoGalleryContextType {
  const context = useContext(PhotoGalleryContext);

  if (!context) {
    throw new Error('Photo Gallery Context not defined');
  }

  return context;
}

export { PhotoGalleryContextProvider, usePhotoGalleryContext };
