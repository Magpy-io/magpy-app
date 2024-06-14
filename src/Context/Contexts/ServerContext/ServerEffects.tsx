import React, { ReactNode, useEffect } from 'react';

import { ServerType } from '~/Helpers/BackendQueries/Types';
import { GetToken, TokenManager, WhoAmI } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { formatAddressHttp } from '~/Helpers/Utilities';

import { useAuthContext } from '../AuthContext';
import { Server, useLocalServersFunctions } from '../LocalServersContext';
import { useMainContext, useMainContextFunctions } from '../MainContext';
import { useServerClaimContext } from '../ServerClaimContext';
import { ServerNetworkType } from './ServerContext';
import { useServerContext, useServerContextFunctions } from './useServerContext';

type PropsType = {
  children: ReactNode;
};

export const ServerEffects: React.FC<PropsType> = props => {
  const { setReachableServer } = useServerContextFunctions();
  const { serverNetwork, token: serverToken, isServerReachable } = useServerContext();
  const { searchAsync } = useLocalServersFunctions();

  const { server: claimedServer } = useServerClaimContext();

  const { token: backendToken } = useAuthContext();

  const { isUsingLocalAccount } = useMainContext();

  const { setIsNewUser } = useMainContextFunctions();

  useEffect(() => {
    if (isServerReachable) {
      setIsNewUser(false);
    }
  }, [isServerReachable, setIsNewUser]);

  useEffect(() => {
    async function FindServer(backendToken: string, claimedServer: ServerType) {
      let serverResponded: { responded: boolean; token: string } | null = null;

      // Start search for local mdns servers
      const serversPromise = searchAsync();

      // Try backend server local address
      serverResponded = await TryServer(
        claimedServer.ipPrivate,
        claimedServer.port,
        backendToken,
      );

      if (serverResponded.responded) {
        setReachableServer({
          ip: claimedServer.ipPrivate,
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
        setReachableServer({
          ip: anyServerResponded.server.ip,
          port: anyServerResponded.server.port,
          token: anyServerResponded.response.token,
        });
        return;
      }

      // Try saved server if present
      if (serverNetwork?.currentIp && serverNetwork.currentPort) {
        serverResponded = await TryServer(
          serverNetwork?.currentIp,
          serverNetwork.currentPort,
          backendToken,
        );
        if (serverResponded.responded) {
          setReachableServer({
            ip: serverNetwork?.currentIp,
            port: serverNetwork?.currentPort,
            token: serverResponded.token,
          });
          return;
        }
      }

      // Try backend server public address
      serverResponded = await TryServer(
        claimedServer.ipPublic,
        claimedServer.port,
        backendToken,
      );

      if (serverResponded.responded) {
        setReachableServer({
          ip: claimedServer.ipPublic,
          port: claimedServer.port,
          token: serverResponded.token,
        });
        return;
      }
    }

    async function FindServerLocal(serverNetwork: ServerNetworkType, serverToken: string) {
      const ret = await TryServerLocalAccount(
        serverNetwork.currentIp,
        serverNetwork.currentPort,
        serverToken,
      );

      if (ret.tokenOk) {
        setReachableServer({
          ip: serverNetwork.currentIp,
          port: serverNetwork.currentPort,
          token: serverToken,
        });
      }
    }

    if (isUsingLocalAccount) {
      if (serverNetwork && serverToken && !isServerReachable) {
        FindServerLocal(serverNetwork, serverToken).catch(console.log);
      }
    } else {
      if (backendToken && claimedServer && !isServerReachable) {
        FindServer(backendToken, claimedServer).catch(console.log);
      }
    }
  }, [
    searchAsync,
    backendToken,
    claimedServer,
    setReachableServer,
    isUsingLocalAccount,
    serverToken,
    serverNetwork,
    isServerReachable,
  ]);

  return props.children;
};

async function TryServerLocalAccount(
  ip: string,
  port: string,
  token: string,
): Promise<{ responded: boolean; tokenOk: boolean }> {
  try {
    console.log('trying ', ip, port);
    TokenManager.SetUserToken(token);
    const res = await WhoAmI.Post({}, { path: formatAddressHttp(ip, port) });
    console.log(res);
    if (res.ok) {
      console.log('Server found');
      return { responded: true, tokenOk: true };
    }
    return { responded: true, tokenOk: false };
  } catch (e) {
    console.log('Error: TryServer', e);
    if (e instanceof ErrorServerUnreachable) {
      return { responded: false, tokenOk: false };
    }
    throw e;
  }
}

async function TryServer(
  ip: string,
  port: string,
  token: string,
): Promise<{ responded: boolean; token: string }> {
  try {
    console.log('trying ', ip, port);
    const res = await GetToken.Post(
      { userToken: token },
      { path: formatAddressHttp(ip, port) },
    );
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
