import { createSlice } from '@reduxjs/toolkit';

import { FilterObjectType } from '~/Components/PhotoComponents/grid/Filter';

type FiltersState = {
  filters: FilterObjectType[];
};

const initialState: FiltersState = {
  filters: [],
};

const galleryFiltersSlice = createSlice({
  name: 'galleryFilters',
  initialState,
  reducers: {
    addOrEditFilter: (state, action: { payload: { filter: FilterObjectType } }) => {
      const foundFilter = state.filters.find(
        filter => filter.type === action.payload.filter.type,
      );
      if (foundFilter) {
        foundFilter.params = action.payload.filter.params;
      } else {
        state.filters.push(action.payload.filter);
      }
    },

    removeFilter: (state, action: { payload: { filter: FilterObjectType } }) => {
      state.filters = state.filters.filter(f => f.type != action.payload.filter.type);
    },

    clearFilters: state => {
      state.filters = [];
    },
  },
});

export const { addOrEditFilter, removeFilter, clearFilters } = galleryFiltersSlice.actions;

export default galleryFiltersSlice.reducer;
