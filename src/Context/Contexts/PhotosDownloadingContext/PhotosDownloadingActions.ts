import { PhotoDownloadingType } from './PhotosDownloadingReducer';

type ActionAdd = {
  type: 'ADD';
  payload: { serverId: string };
};

type ActionAddMultiple = {
  type: 'ADD_MULTIPLE';
  payload: { serverId: string }[];
};

type ActionShift = {
  type: 'SHIFT';
  payload?: undefined;
};

type ActionUpdate = {
  type: 'UPDATE';
  payload: PhotoDownloadingType;
};

export type Actions = ActionAdd | ActionAddMultiple | ActionShift | ActionUpdate;

// Actions creators

export function add(serverId: string): ActionAdd {
  return { type: 'ADD', payload: { serverId } };
}

export function addMultiple(serverIds: string[]): ActionAddMultiple {
  return {
    type: 'ADD_MULTIPLE',
    payload: serverIds.map(s => {
      return {
        serverId: s,
      };
    }),
  };
}

export function shift(): ActionShift {
  return { type: 'SHIFT' };
}

export function update(photo: PhotoDownloadingType): ActionUpdate {
  return { type: 'UPDATE', payload: photo };
}
