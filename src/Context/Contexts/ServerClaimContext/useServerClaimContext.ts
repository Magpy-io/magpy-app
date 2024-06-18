import { useCallback } from 'react';

import { DeleteMyServer, GetMyServerInfo } from '~/Helpers/BackendQueries';
import { ClaimServer } from '~/Helpers/ServerQueries';
import { formatAddressHttp } from '~/Helpers/Utilities';

import { useAuthContext } from '../AuthContext';
import { useServerClaimContextSetters } from './ServerClaimContext';

export function useServerClaimFunctions() {
  const { token } = useAuthContext();

  const serverClaimContextSetters = useServerClaimContextSetters();

  const { setServer } = serverClaimContextSetters;

  const tryClaimServer = useCallback(
    async (ip: string, port: string) => {
      if (!token) {
        return false;
      }

      try {
        const ret = await ClaimServer.Post(
          { userToken: token },
          { path: formatAddressHttp(ip, port) },
        );
        console.log('Claim Server ret with token', token, ret);
        if (ret.ok) {
          const serverInfo = await GetMyServerInfo.Post();
          console.log('Server Info', serverInfo);
          if (serverInfo.ok) {
            setServer(serverInfo.data.server);
            return true;
          }
        }
        return false;
      } catch (err) {
        console.log('Claim Server Error', err);
        return false;
      }
    },
    [setServer, token],
  );

  const forgetServer = useCallback(async () => {
    if (!token) {
      return false;
    }

    const ret = await DeleteMyServer.Post();

    if (ret.ok) {
      setServer(null);
      return true;
    } else {
      console.log('Error while deleting own server', JSON.stringify(ret));
      return false;
    }
  }, [setServer, token]);

  return { tryClaimServer, forgetServer };
}
