import React, { useEffect, useState } from 'react';

import { useAuthContext } from '~/Context/Contexts/AuthContext';
import { GetMyServerInfo, Types } from '~/Helpers/BackendQueries';

import { useMainContext } from '../MainContextProvider';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type ServerClaimDataType = {
  server: Types.ServerType | null;
  setServer: SetStateType<Types.ServerType | null>;
  hasServer: boolean;
  setHasServer: SetStateType<boolean>;
};

export function useServerClaimData(): ServerClaimDataType {
  const [server, setServer] = useState<Types.ServerType | null>(null);
  const [hasServer, setHasServer] = useState<boolean>(true);

  return { server, setServer, hasServer, setHasServer };
}

export function useServerClaimEffects() {
  const { serverClaimData } = useMainContext();
  const { token } = useAuthContext();
  const { setServer, setHasServer } = serverClaimData;

  useEffect(() => {
    async function GetServer() {
      try {
        const serverInfo = await GetMyServerInfo.Post();
        if (serverInfo.ok) {
          setServer(serverInfo.data.server);
          setHasServer(true);
        } else {
          setHasServer(false);
        }
      } catch (e) {
        console.log('Error: GetMyServerInfo backend request failed');
      }
    }
    if (token) {
      GetServer().catch(console.log);
    }
  }, [setHasServer, setServer, token]);
}
