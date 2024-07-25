import React, { ReactNode, createContext, useContext, useState } from 'react';

import { PermissionsContextEffect } from './PermissionsContextEffect';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type PermissionsContextDataType = {
  hasMediaPermission: boolean;
  setHasMediaPermission: SetStateType<boolean>;
};

const initialState: PermissionsContextDataType = {
  hasMediaPermission: true,
  setHasMediaPermission: () => {},
};

const PermissionsContext = createContext<PermissionsContextDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const PermissionsContextProvider: React.FC<PropsType> = props => {
  const [hasMediaPermission, setHasMediaPermission] = useState(true);

  return (
    <PermissionsContext.Provider value={{ hasMediaPermission, setHasMediaPermission }}>
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
