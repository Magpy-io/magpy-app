import { useCallback } from 'react';

import { SetPath } from '~/Helpers/ServerQueries';
import { formatAddressHttp } from '~/Helpers/Utilities';

import { useServerContextInner, useServerContextSettersInner } from './ServerContext';

export function useServerContextFunctions() {
  const { setIsServerReachable } = useServerContextSettersInner();

  const { tokenState, serverNetworkState } = useServerContextInner();
  const [, , setServerNetwork] = serverNetworkState;
  const [, , setToken] = tokenState;

  const setReachableServer = useCallback(
    (server: { ip: string; port: string; token: string }) => {
      setServerNetwork({
        currentPort: server.port,
        currentIp: server.ip,
      });
      setToken(server.token);
      setIsServerReachable(true);
      setAddressForServerApi(server.port, server.port);
    },
    [setIsServerReachable, setServerNetwork, setToken],
  );

  const setServer = useCallback(
    (ip: string, port: string) => {
      setServerNetwork({
        currentIp: ip,
        currentPort: port,
      });
    },
    [setServerNetwork],
  );

  return { setReachableServer, setServer };
}

function setAddressForServerApi(ip: string, port: string) {
  SetPath(formatAddressHttp(ip, port));
}

export function useServerContext() {
  const { isServerReachable, findingServer, tokenState, serverNetworkState } =
    useServerContextInner();

  const [serverNetwork] = serverNetworkState;
  const [token] = tokenState;

  return { isServerReachable, findingServer, token, serverNetwork };
}
