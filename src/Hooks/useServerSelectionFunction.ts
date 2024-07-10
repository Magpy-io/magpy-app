import { useCallback } from 'react';

import { useAuthContext } from '~/Context/Contexts/AuthContext';
import { useMainContext } from '~/Context/Contexts/MainContext';
import { useServerClaimFunctions } from '~/Context/Contexts/ServerClaimContext';
import { useServerContext, useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import { GetToken, IsClaimed, TokenManager, WhoAmI } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { formatAddressHttp } from '~/Helpers/Utilities';
import { useToast } from '~/Hooks/useToast';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';

export function useServerSelectionFunction() {
  const { tryClaimServer } = useServerClaimFunctions();
  const { token: userToken } = useAuthContext();
  const { navigate } = useMainStackNavigation();
  const { setServerSelecting, setReachableServer } = useServerContextFunctions();

  const { token: serverToken } = useServerContext();
  const { showToastError } = useToast();

  const { isUsingLocalAccount } = useMainContext();

  const SelectServer = useCallback(
    async (server: { ip: string; port: string }) => {
      if (isUsingLocalAccount) {
        try {
          const ret = await IsClaimed.Post(
            {},
            { path: formatAddressHttp(server.ip, server.port) },
          );

          if (ret.ok) {
            if (ret.data.claimed == 'Remotely') {
              showToastError('Server already claimed by another user.');
              return;
            }

            setServerSelecting(server.ip, server.port);

            if (ret.data.claimed == 'None') {
              navigate('ServerClaim');
            } else {
              if (serverToken) {
                TokenManager.SetUserToken(serverToken);
                const ret = await WhoAmI.Post(
                  {},
                  { path: formatAddressHttp(server.ip, server.port) },
                );

                if (ret.ok) {
                  setReachableServer({ ip: server.ip, port: server.port, token: serverToken });
                  navigate('Tabs');
                  return;
                }
              }

              navigate('ServerLogin');
            }
          }
        } catch (err) {
          console.log(err);
          if (err instanceof ErrorServerUnreachable) {
            showToastError('Server unreachable');
          } else {
            showToastError('Unexpected error while connecting to this server.');
          }
        }
      } else {
        if (!userToken) {
          showToastError('You need to be logged in before being able to claim a server.');
          return;
        }

        const serverClaimed = await tryClaimServer(server.ip, server.port);

        if (serverClaimed.claimed) {
          navigate('Tabs');
          return;
        }

        if (
          serverClaimed.error != 'SERVER_ALREADY_CLAIMED' &&
          serverClaimed.error != 'SERVER_UNREACHABLE'
        ) {
          showToastError('Unexpected error while connecting to this server.');
          return;
        }

        if (serverClaimed.error == 'SERVER_UNREACHABLE') {
          showToastError('Server unreachable');
          return;
        }

        const res = await GetToken.Post(
          { userToken: userToken },
          { path: formatAddressHttp(server.ip, server.port) },
        );

        if (res.ok) {
          const ServerToken = TokenManager.GetUserToken();
          setReachableServer({
            ip: server.ip,
            port: server.port,
            token: ServerToken,
          });
          navigate('Tabs');
        } else {
          showToastError('Server already claimed by another user.');
          return;
        }
      }
    },
    [
      isUsingLocalAccount,
      setServerSelecting,
      showToastError,
      navigate,
      serverToken,
      setReachableServer,
      userToken,
      tryClaimServer,
    ],
  );

  return { SelectServer };
}
