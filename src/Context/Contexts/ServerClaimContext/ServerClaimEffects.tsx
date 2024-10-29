import React, { ReactNode, useEffect } from 'react';

import { GetMyServerInfo } from '~/Helpers/BackendQueries';
import { LOG } from '~/Helpers/Logging/Logger';

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
      try {
        const serverInfo = await GetMyServerInfo.Post();

        if (serverInfo.ok) {
          setServer(serverInfo.data.server);
        } else {
          setServer(null);
          LOG.error('Error: GetMyServerInfo backend request not ok', serverInfo);
        }
      } catch (e) {
        LOG.error('Error: GetMyServerInfo backend request failed', e);
      }
    }
    if (!loading && token) {
      GetServer().catch(LOG.error);
    }
  }, [loading, setServer, token]);

  return props.children;
};
