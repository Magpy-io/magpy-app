import React, { ReactNode, useEffect } from 'react';

import * as AsyncStorageFunctions from '~/Helpers/AsyncStorage';
import { ServerType } from '~/Helpers/BackendQueries/Types';
import { GetToken, TokenManager } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';

import { useAuthContext } from '../AuthContext';
import { Server, useLocalServersFunctions } from '../LocalServersContext';
import { useServerClaimContext } from '../ServerClaimContext';
import { useServerContextSetters } from './ServerContext';
import { useServerContextFunctions } from './useServerContext';

type PropsType = {
  children: ReactNode;
};

export const ServerEffects: React.FC<PropsType> = props => {
  const { setServerSearchFailed } = useServerContextSetters();

  const { setReachableServer } = useServerContextFunctions();

  const { searchAsync } = useLocalServersFunctions();

  const { server: claimedServer } = useServerClaimContext();

  const { token } = useAuthContext();

  useEffect(() => {
    async function FindServer(backendToken: string, claimedServer: ServerType) {
      let serverResponded: { responded: boolean; token: string } | null = null;

      // Start search for local mdns servers
      const serversPromise = searchAsync();

      // Try async storage local address
      const AsyncStorageNetwork = await AsyncStorageFunctions.getServerInfo();
      if (AsyncStorageNetwork.ipLocal && AsyncStorageNetwork.port) {
        serverResponded = await TryServer(
          AsyncStorageNetwork.ipLocal,
          AsyncStorageNetwork.port,
          backendToken,
        );
        if (serverResponded.responded) {
          await setReachableServer({
            ipLocal: AsyncStorageNetwork.ipLocal,
            port: AsyncStorageNetwork.port,
            token: serverResponded.token,
          });
          return;
        } else {
          await AsyncStorageFunctions.storeServerInfo({ ipLocal: '' });
        }
      }

      // Try backend server local address
      serverResponded = await TryServer(
        claimedServer.ipPrivate,
        claimedServer.port,
        backendToken,
      );

      if (serverResponded.responded) {
        await setReachableServer({
          ipLocal: claimedServer.ipPrivate,
          port: claimedServer.port,
          token: serverResponded.token,
        });
        return;
      }

      // Try discovered servers
      const servers = await serversPromise;

      const serversTriedPromises = servers.map(server => {
        return TryServer(server.ip, server.port, backendToken).then(response => {
          if (response.responded) {
            return { server, response };
          } else {
            throw 'NO_RESPONSE';
          }
        });
      });

      let anyServerResponded:
        | {
            server: Server;
            response: {
              responded: boolean;
              token: string;
            };
          }
        | undefined;

      try {
        anyServerResponded = await Promise.any(serversTriedPromises);
      } catch (error) {
        if (error instanceof AggregateError) {
          const allErrorsNoResponse = error.errors.reduce((p: boolean, c) => {
            return p && c === 'NO_RESPONSE';
          }, true);

          if (!allErrorsNoResponse) {
            console.log(error);
          }
        } else {
          console.log(error);
        }
      }

      if (anyServerResponded?.response.responded) {
        await setReachableServer({
          ipLocal: anyServerResponded.server.ip,
          port: anyServerResponded.server.port,
          token: anyServerResponded.response.token,
        });

        return;
      }

      // Try async storage public address
      if (AsyncStorageNetwork.ipPublic && AsyncStorageNetwork.port) {
        serverResponded = await TryServer(
          AsyncStorageNetwork.ipPublic,
          AsyncStorageNetwork.port,
          backendToken,
        );
        if (serverResponded.responded) {
          await setReachableServer({
            ipPublic: AsyncStorageNetwork.ipPublic,
            port: AsyncStorageNetwork.port,
            token: serverResponded.token,
          });
          return;
        } else {
          await AsyncStorageFunctions.storeServerInfo({ ipPublic: '' });
        }
      }

      // Try backend server public address
      serverResponded = await TryServer(
        claimedServer.ipPublic,
        claimedServer.port,
        backendToken,
      );

      if (serverResponded.responded) {
        await setReachableServer({
          ipPublic: claimedServer.ipPublic,
          port: claimedServer.port,
          token: serverResponded.token,
        });
        return;
      }

      setServerSearchFailed(true);
    }

    if (token && claimedServer) {
      FindServer(token, claimedServer).catch(console.log);
    }
  }, [searchAsync, token, claimedServer, setReachableServer, setServerSearchFailed]);

  return props.children;
};

async function TryServer(
  ip: string,
  port: string,
  token: string,
): Promise<{ responded: boolean; token: string }> {
  try {
    console.log('trying ', ip, port);
    const res = await GetToken.Post({ userToken: token }, { path: `http://${ip}:${port}` });
    console.log(res);
    if (res.ok) {
      console.log('Server found');
      return { responded: true, token: TokenManager.GetUserToken() };
    }
    return { responded: false, token: '' };
  } catch (e) {
    console.log('Error: TryServer', e);
    if (e instanceof ErrorServerUnreachable) {
      return { responded: false, token: '' };
    }
    throw e;
  }
}
