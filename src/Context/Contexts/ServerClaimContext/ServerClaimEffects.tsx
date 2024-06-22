import React, { ReactNode, useEffect } from 'react';

import { GetMyServerInfo } from '~/Helpers/BackendQueries';

import { useAuthContext } from '../AuthContext';
import { useServerClaimContextSetters } from './ServerClaimContext';

type PropsType = {
  children: ReactNode;
};

export const ServerClaimEffects: React.FC<PropsType> = props => {
  const { token, loading } = useAuthContext();

  const { setServer } = useServerClaimContextSetters();

  useEffect(() => {
    async function GetServer() {
      console.log('Getting claimed server');
      try {
        const serverInfo = await GetMyServerInfo.Post();
        console.log(serverInfo);
        if (serverInfo.ok) {
          setServer(serverInfo.data.server);
        } else {
          setServer(null);
          console.log(serverInfo);
        }
      } catch (e) {
        console.log('Error: GetMyServerInfo backend request failed');
        console.log(e);
      }
    }
    if (!loading && token) {
      GetServer().catch(console.log);
    }
  }, [loading, setServer, token]);

  return props.children;
};
