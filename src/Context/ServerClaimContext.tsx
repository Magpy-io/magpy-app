import React, { useEffect, useState } from 'react';

import { GetMyServerInfo, Types } from '~/Helpers/BackendQueries';
import { ClaimServer, SetPath } from '~/Helpers/ServerQueries';

import { useMainContext } from './MainContextProvider';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type ServerClaimDataType = {
  server: Types.ServerType | null;
  setServer: SetStateType<Types.ServerType | null>;
  hasServer: boolean;
  setHasServer: SetStateType<boolean>;
};

export function useServerClaimData(): ServerClaimDataType {
  const [server, setServer] = useState<Types.ServerType | null>(null);
  const [hasServer, setHasServer] = useState<boolean>(false);

  return { server, setServer, hasServer, setHasServer };
}

export function useServerClaimEffects() {
  const { serverClaim, auth } = useMainContext();
  const { setServer, setHasServer } = serverClaim;
  const { token } = auth;

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

export function useServerClaim() {
  const { serverClaim, auth } = useMainContext();
  const { setServer, setHasServer } = serverClaim;
  const { token } = auth;

  const claimServer = async (path: string) => {
    if (!token) {
      return;
    }

    SetPath(path);
    try {
      const ret = await ClaimServer.Post({ userToken: token });
      console.log('Claim Server ret with token', token, ret);
      if (ret.ok) {
        const serverInfo = await GetMyServerInfo.Post();
        console.log('Server Info', serverInfo);
        if (serverInfo.ok) {
          setServer(serverInfo.data.server);
          setHasServer(true);
        }
      }
    } catch (err) {
      console.log('Claim Server Error', err);
    }
  };

  return { claimServer };
}
