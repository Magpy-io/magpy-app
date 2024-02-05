import { produce } from 'immer';

import { Actions } from './PhotosDownloadingActions';

export type PhotoDownloadingType = { serverId: string; percentage: number };

export type PhotosDownloadingStateType = {
  photosDownloading: PhotoDownloadingType[];
};

export const initialState: PhotosDownloadingStateType = {
  photosDownloading: [],
};

function ReducerDraft(
  draft: PhotosDownloadingStateType,
  action: Actions,
): PhotosDownloadingStateType {
  switch (action.type) {
    case 'ADD': {
      draft.photosDownloading.push({ serverId: action.payload.serverId, percentage: 0 });
      return draft;
    }

    case 'ADD_MULTIPLE': {
      draft.photosDownloading.push(
        ...action.payload.map(p => {
          return { serverId: p.serverId, percentage: 0 };
        }),
      );
      return draft;
    }

    case 'SHIFT': {
      draft.photosDownloading.shift();
      return draft;
    }

    case 'UPDATE': {
      const photoToUpdate = draft.photosDownloading.find(
        p => p.serverId == action.payload.serverId,
      );
      if (!photoToUpdate) {
        return draft;
      }
      photoToUpdate.percentage = action.payload.percentage;
      return draft;
    }
  }
}

export const Reducer = produce(ReducerDraft);
