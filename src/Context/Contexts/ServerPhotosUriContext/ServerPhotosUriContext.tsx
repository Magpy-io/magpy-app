import React, { ReactNode, createContext, useContext } from 'react';

import { ServerPhotosUriEffect } from './ServerPhotosUriEffect';

export type ServerPhotosUriDataType = {
  serverPhotosThumbnailUri: Map<string, string>;
  serverPhotosCompressedUri: Map<string, string>;
};

const initialState: ServerPhotosUriDataType = {
  serverPhotosThumbnailUri: new Map(),
  serverPhotosCompressedUri: new Map(),
};

const ServerPhotosUriContext = createContext<ServerPhotosUriDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const ServerPhotosUriContextProvider: React.FC<PropsType> = props => {
  return (
    <ServerPhotosUriContext.Provider value={initialState}>
      <ServerPhotosUriEffect>{props.children}</ServerPhotosUriEffect>
    </ServerPhotosUriContext.Provider>
  );
};

export function useServerPhotosUriContextInner(): ServerPhotosUriDataType {
  const context = useContext(ServerPhotosUriContext);

  if (!context) {
    throw new Error('ServerPhotosUriContext not defined');
  }

  return context;
}
