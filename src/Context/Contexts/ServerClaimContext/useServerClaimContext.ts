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

  const tryClaimServer: (
    ip: string,
    port: string,
  ) => Promise<{
    claimed: boolean;
    error?: 'NO_BACKEND_TOKEN' | 'SERVER_ALREADY_CLAIMED' | 'UNEXPECTED_ERROR';
  }> = useCallback(
    async (ip: string, port: string) => {
      if (!token) {
        return { claimed: false, error: 'NO_BACKEND_TOKEN' };
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
            return { claimed: true };
          } else {
            return { claimed: false, error: 'UNEXPECTED_ERROR' };
          }
        }

        if (ret.errorCode == 'SERVER_ALREADY_CLAIMED') {
          return { claimed: false, error: 'SERVER_ALREADY_CLAIMED' };
        } else {
          return { claimed: false, error: 'UNEXPECTED_ERROR' };
        }
      } catch (err) {
        console.log('Claim Server Error', err);
        return { claimed: false, error: 'UNEXPECTED_ERROR' };
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
