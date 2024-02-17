import { createSlice } from '@reduxjs/toolkit';

type SortType = 'Newest' | 'Oldest';
type GroupType = 'Day' | 'Month';

type OptionsState = {
  sortBy: SortType;
  groupBy: GroupType;
};

const initialState: OptionsState = {
  sortBy: 'Newest',
  groupBy: 'Day',
};

const photoOptionsSlice = createSlice({
  name: 'galleryOptions',
  initialState,
  reducers: {
    setSortBy: (state, action: { payload: { option: SortType } }) => {
      state.sortBy = action.payload.option;
    },
    setGroupBy: (state, action: { payload: { option: GroupType } }) => {
      state.groupBy = action.payload.option;
    },
  },
});

export const { setSortBy, setGroupBy } = photoOptionsSlice.actions;

export default photoOptionsSlice.reducer;
