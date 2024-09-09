import { createSlice } from '@reduxjs/toolkit';

import { FilterObjectType } from '~/Components/PhotoComponents/filters/Filters/Filter';

type FiltersState = {
  filters: FilterObjectType[];
  serverFilters: FilterObjectType[];
};

const initialState: FiltersState = {
  filters: [],
  serverFilters: [],
};

const galleryFiltersSlice = createSlice({
  name: 'galleryFilters',
  initialState,
  reducers: {
    addGalleryFilters: (state, action: { payload: { filters: FilterObjectType[] } }) => {
      state.filters = action.payload.filters;
    },
    removeGalleryFilter: (state, action: { payload: { filter: FilterObjectType } }) => {
      state.filters = state.filters.filter(f => f.type != action.payload.filter.type);
    },

    addServerFilters: (state, action: { payload: { filters: FilterObjectType[] } }) => {
      state.serverFilters = action.payload.filters;
    },
    removeServerFilter: (state, action: { payload: { filter: FilterObjectType } }) => {
      state.serverFilters = state.serverFilters.filter(
        f => f.type != action.payload.filter.type,
      );
    },
  },
});

export const { removeGalleryFilter, addGalleryFilters, addServerFilters, removeServerFilter } =
  galleryFiltersSlice.actions;

export default galleryFiltersSlice.reducer;
