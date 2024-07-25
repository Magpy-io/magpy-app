import React, { ReactNode, createContext, useContext, useState } from 'react';

import { PermissionsContextEffect } from './PermissionsContextEffect';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type PermissionStates = 'GRANTED' | 'PENDING' | 'REJECTED';

export type PermissionsContextDataType = {
  mediaPermissionStatus: PermissionStates;
  notificationsPermissionStatus: PermissionStates;
};

export type PermissionsContextSettersType = {
  setMediaPermissionStatus: SetStateType<PermissionStates>;
  setNotificationsPermissionStatus: SetStateType<PermissionStates>;
};

const initialStateData: PermissionsContextDataType = {
  mediaPermissionStatus: 'PENDING',
  notificationsPermissionStatus: 'PENDING',
};

const initialStateSetters: PermissionsContextSettersType = {
  setMediaPermissionStatus: () => {},
  setNotificationsPermissionStatus: () => {},
};

const PermissionsContext = createContext<PermissionsContextDataType>(initialStateData);
const PermissionsContextSetters =
  createContext<PermissionsContextSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const PermissionsContextProvider: React.FC<PropsType> = props => {
  const [mediaPermissionStatus, setMediaPermissionStatus] =
    useState<PermissionStates>('PENDING');
  const [notificationsPermissionStatus, setNotificationsPermissionStatus] =
    useState<PermissionStates>('PENDING');

  return (
    <PermissionsContext.Provider
      value={{ mediaPermissionStatus, notificationsPermissionStatus }}>
      <PermissionsContextSetters.Provider
        value={{ setMediaPermissionStatus, setNotificationsPermissionStatus }}>
        <PermissionsContextEffect>{props.children}</PermissionsContextEffect>
      </PermissionsContextSetters.Provider>
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

export function usePermissionsContextSettersInner(): PermissionsContextSettersType {
  const context = useContext(PermissionsContextSetters);

  if (!context) {
    throw new Error('PermissionsContext not defined');
  }

  return context;
}
