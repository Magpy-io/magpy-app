import React, { ReactNode, useEffect } from 'react';

import { GetMyServerInfo } from '~/Helpers/BackendQueries';

import { useAuthContext } from '../AuthContext';
import { useServerClaimContextSetters } from './ServerClaimContext';

type PropsType = {
  children: ReactNode;
};

export const ServerClaimEffects: React.FC<PropsType> = props => {
  const { token } = useAuthContext();

  const serverClaimContextSetters = useServerClaimContextSetters();

  const { setServer, setHasServer } = serverClaimContextSetters;

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

  return props.children;
};
