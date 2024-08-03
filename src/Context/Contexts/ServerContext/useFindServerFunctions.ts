import { useCallback } from 'react';

import { GetToken, TokenManager, WhoAmI } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { formatAddressHttp } from '~/Helpers/Utilities';

import { useAuthContext } from '../AuthContext';
import { Server, useLocalServersFunctions } from '../LocalServersContext';
import { useServerClaimContext } from '../ServerClaimContext';
import { ConnectingToServerError, useServerContextSettersInner } from './ServerContext';
import { useServerContext, useServerContextFunctions } from './useServerContext';

export function useFindServerFunctions() {
  const { setReachableServer } = useServerContextFunctions();
  const { searchAsync } = useLocalServersFunctions();
  const { setError, setFindingServer } = useServerContextSettersInner();
  const { serverNetwork, token: serverToken, isServerReachable } = useServerContext();
  const { loading, token: backendToken } = useAuthContext();
  const { server: claimedServer } = useServerClaimContext();

  const FindServerLocal = useCallback(async () => {
    if (!serverNetwork || !serverToken || isServerReachable) {
      return;
    }

    console.log('Finding Server Local');

    setFindingServer(true);
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
    } else {
      if (ret.responded) {
        setError('SERVER_AUTH_FAILED');
      } else {
        setError('SERVER_NOT_REACHABLE');
      }
    }

    setFindingServer(false);
  }, [
    isServerReachable,
    serverNetwork,
    serverToken,
    setError,
    setFindingServer,
    setReachableServer,
  ]);

  const FindServerRemote = useCallback(async () => {
    if (loading || !backendToken || !claimedServer || isServerReachable) {
      return;
    }
    console.log('Finding Server Remote');

    let savedServerResponded: boolean = false;

    setFindingServer(true);
    let serverResponded: { responded: boolean; token: string } | null = null;
    let serverErrorToSet: ConnectingToServerError = 'SERVER_NOT_REACHABLE';
    // Start search for local mdns servers
    const serversPromise = searchAsync().catch(console.log);

    // Try saved server if present
    if (serverNetwork?.currentIp && serverNetwork.currentPort) {
      serverResponded = await TryServerRemote(
        serverNetwork.currentIp,
        serverNetwork.currentPort,
        backendToken,
      );
      if (serverResponded.token) {
        setReachableServer({
          ip: serverNetwork?.currentIp,
          port: serverNetwork?.currentPort,
          token: serverResponded.token,
        });
        setFindingServer(false);
        savedServerResponded = true;
      }

      if (serverResponded.responded) {
        serverErrorToSet = 'SERVER_AUTH_FAILED';
      }
    }

    // Try backend server local address
    serverResponded = await TryServerRemote(
      claimedServer.ipPrivate,
      claimedServer.port,
      backendToken,
    );

    if (serverResponded.token) {
      setReachableServer({
        ip: claimedServer.ipPrivate,
        port: claimedServer.port,
        token: serverResponded.token,
      });
      return;
    }

    if (serverResponded.responded) {
      serverErrorToSet = 'SERVER_AUTH_FAILED';
    }

    // Try discovered servers
    const servers = await serversPromise;

    if (servers) {
      const serversTriedPromises = servers.map(server => {
        return TryServerRemote(server.ip, server.port, backendToken).then(response => {
          if (response.token) {
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

      if (anyServerResponded?.response.token) {
        setReachableServer({
          ip: anyServerResponded.server.ip,
          port: anyServerResponded.server.port,
          token: anyServerResponded.response.token,
        });
        setFindingServer(false);
        return;
      }
    }

    // No need to try public address because a local one was already found
    if (savedServerResponded) {
      setFindingServer(false);
      return;
    }

    // Try backend server public address
    serverResponded = await TryServerRemote(
      claimedServer.ipPublic,
      claimedServer.port,
      backendToken,
    );

    if (serverResponded.token) {
      setReachableServer({
        ip: claimedServer.ipPublic,
        port: claimedServer.port,
        token: serverResponded.token,
      });
      setFindingServer(false);
      return;
    }

    if (serverResponded.responded) {
      serverErrorToSet = 'SERVER_AUTH_FAILED';
    }

    setError(serverErrorToSet);
    setFindingServer(false);
  }, [
    backendToken,
    claimedServer,
    isServerReachable,
    loading,
    searchAsync,
    serverNetwork,
    setError,
    setFindingServer,
    setReachableServer,
  ]);

  return { FindServerLocal, FindServerRemote };
}

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

async function TryServerRemote(
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

    return { responded: true, token: '' };
  } catch (e) {
    console.log('Error: TryServer', e);
    if (e instanceof ErrorServerUnreachable) {
      return { responded: false, token: '' };
    }
    throw e;
  }
}
