import React, { ReactNode, createContext, useContext, useState } from 'react';

import { PermissionsContextEffect } from './PermissionsContextEffect';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type PermissionStates = 'GRANTED' | 'PENDING' | 'REJECTED';

export type PermissionsContextDataType = {
  mediaPermissionStatus: PermissionStates;
  setMediaPermissionStatus: SetStateType<PermissionStates>;
};

const initialState: PermissionsContextDataType = {
  mediaPermissionStatus: 'PENDING',
  setMediaPermissionStatus: () => {},
};

const PermissionsContext = createContext<PermissionsContextDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const PermissionsContextProvider: React.FC<PropsType> = props => {
  const [mediaPermissionStatus, setMediaPermissionStatus] =
    useState<PermissionStates>('PENDING');

  return (
    <PermissionsContext.Provider value={{ mediaPermissionStatus, setMediaPermissionStatus }}>
      <PermissionsContextEffect>{props.children}</PermissionsContextEffect>
    </PermissionsContext.Provider>
  );
};

export function usePermissionsContextInner(): PermissionsContextDataType {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error('PermissionsContext not defined');
  }

  return context;
}
