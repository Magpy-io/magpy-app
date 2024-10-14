import { useCallback } from 'react';

import { SetPath } from '~/Helpers/ServerQueries';
import { formatAddressHttp } from '~/Helpers/Utilities';

import { useServerContextInner, useServerContextSettersInner } from './ServerContext';

export function useServerContextFunctions() {
  const { setIsServerReachable, setServerNetworkSelecting, setError } =
    useServerContextSettersInner();

  const { tokenState, serverNetworkState, serverNetworkSelecting } = useServerContextInner();
  const [, , setServerNetwork] = serverNetworkState;
  const [, , setToken] = tokenState;

  const setReachableServer = useCallback(
    (server: { ip: string; port: string; token: string }) => {
      setServerNetwork({
        currentPort: server.port,
        currentIp: server.ip,
      });
      setToken(server.token);
      setAddressForServerApi(server.ip, server.port);
      setError(null);
      setIsServerReachable(true);
    },
    [setError, setIsServerReachable, setServerNetwork, setToken],
  );

  const setServerSelecting = useCallback(
    (ip: string, port: string) => {
      setAddressForServerApi(ip, port);
      setServerNetworkSelecting({
        currentIp: ip,
        currentPort: port,
      });
    },
    [setServerNetworkSelecting],
  );

  const setCurrentSelectingServerReachable = useCallback(
    (token: string) => {
      if (!serverNetworkSelecting) {
        console.log(
          'Error setCurrentServerReachable: no serverNetworkSelecting to set as reachable.',
        );
        return;
      }
      setReachableServer({
        ip: serverNetworkSelecting.currentIp,
        port: serverNetworkSelecting.currentPort,
        token,
      });
    },
    [serverNetworkSelecting, setReachableServer],
  );

  const forgetServer = useCallback(() => {
    setIsServerReachable(false);
    setServerNetwork(null);
    setToken(null);
    setError(null);
    clearAddressForServerApi();
  }, [setError, setIsServerReachable, setServerNetwork, setToken]);

  const setServerNotReachable = useCallback(() => {
    setIsServerReachable(false);
  }, [setIsServerReachable]);

  return {
    setReachableServer,
    setServerSelecting,
    setCurrentSelectingServerReachable,
    forgetServer,
    setServerNetworkSelecting,
    setServerNotReachable,
  };
}

function setAddressForServerApi(ip: string, port: string) {
  SetPath(formatAddressHttp(ip, port));
}

function clearAddressForServerApi() {
  SetPath('');
}

export function useServerContext() {
  const {
    isServerReachable,
    findingServer,
    tokenState,
    serverNetworkState,
    error,
    serverNetworkSelecting,
  } = useServerContextInner();

  const [serverNetwork] = serverNetworkState;
  const [token] = tokenState;

  let serverPath = null;
  if (serverNetwork) {
    serverPath = formatAddressHttp(serverNetwork.currentIp, serverNetwork.currentPort);
  }

  return {
    isServerReachable,
    findingServer,
    token,
    serverNetwork,
    error,
    serverNetworkSelecting,
    serverPath,
  };
}
