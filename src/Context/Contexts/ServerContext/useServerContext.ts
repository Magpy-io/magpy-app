import { useCallback } from 'react';

import { SetPath } from '~/Helpers/ServerQueries';
import { formatAddressHttp } from '~/Helpers/Utilities';

import { useServerContextInner, useServerContextSettersInner } from './ServerContext';

export function useServerContextFunctions() {
  const { setIsServerReachable } = useServerContextSettersInner();

  const { tokenState, serverNetworkState } = useServerContextInner();
  const [serverNetwork, , setServerNetwork] = serverNetworkState;
  const [, , setToken] = tokenState;

  const setReachableServer = useCallback(
    (server: { ip: string; port: string; token: string }) => {
      setServerNetwork({
        currentPort: server.port,
        currentIp: server.ip,
      });
      setToken(server.token);
      setIsServerReachable(true);
      setAddressForServerApi(server.ip, server.port);
    },
    [setIsServerReachable, setServerNetwork, setToken],
  );

  const setServer = useCallback(
    (ip: string, port: string) => {
      setAddressForServerApi(ip, port);
      setServerNetwork({
        currentIp: ip,
        currentPort: port,
      });
    },
    [setServerNetwork],
  );

  const setCurrentServerReachable = useCallback(
    (token: string) => {
      if (!serverNetwork) {
        console.log('Error setCurrentServerReachable: no currentServer to set as reachable.');
        return;
      }
      setReachableServer({
        ip: serverNetwork.currentIp,
        port: serverNetwork.currentPort,
        token,
      });
    },
    [serverNetwork, setReachableServer],
  );

  const forgetServer = useCallback(() => {
    setServerNetwork(null);
    setIsServerReachable(false);
    setToken(null);
  }, [setIsServerReachable, setServerNetwork, setToken]);

  return { setReachableServer, setServer, setCurrentServerReachable, forgetServer };
}

function setAddressForServerApi(ip: string, port: string) {
  SetPath(formatAddressHttp(ip, port));
}

export function useServerContext() {
  const { isServerReachable, findingServer, tokenState, serverNetworkState, error } =
    useServerContextInner();

  const [serverNetwork] = serverNetworkState;
  const [token] = tokenState;

  return { isServerReachable, findingServer, token, serverNetwork, error };
}
