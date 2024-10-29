import { useCallback } from 'react';

import { DeleteMyServer, GetMyServerInfo } from '~/Helpers/BackendQueries';
import { LOG } from '~/Helpers/Logging/Logger';
import { ClaimServer } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
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
    error?:
      | 'NO_BACKEND_TOKEN'
      | 'SERVER_ALREADY_CLAIMED'
      | 'SERVER_UNREACHABLE'
      | 'UNEXPECTED_ERROR';
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

        if (ret.ok) {
          const serverInfo = await GetMyServerInfo.Post();

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
        LOG.error('Claim Server Error', err);
        if (err instanceof ErrorServerUnreachable) {
          return { claimed: false, error: 'SERVER_UNREACHABLE' };
        } else {
          return { claimed: false, error: 'UNEXPECTED_ERROR' };
        }
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
      LOG.error('Error while deleting own server', ret);
      return false;
    }
  }, [setServer, token]);

  return { tryClaimServer, forgetServer };
}
