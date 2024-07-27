import { RootState } from '../../Store';

export const SortOptionSelector = (state: RootState) => state.galleryOptions.sortBy;
export const GroupOptionSelector = (state: RootState) => state.galleryOptions.groupBy;
