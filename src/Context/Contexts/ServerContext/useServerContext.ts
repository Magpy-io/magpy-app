import { useCallback } from 'react';

import * as AsyncStorageFunctions from '~/Helpers/AsyncStorage';
import { SetPath } from '~/Helpers/ServerQueries';

import { useServerContextSetters } from './ServerContext';

export function useServerContextFunctions() {
  const { setServerNetwork, setIsServerReachable, setServerSearchFailed } =
    useServerContextSetters();

  const setReachableServer = useCallback(
    async (server: { ipLocal?: string; ipPublic?: string; port: string; token: string }) => {
      setServerNetwork(s => {
        return {
          ipLocal: server.ipLocal ?? s.ipLocal,
          ipPublic: server.ipPublic ?? s.ipPublic,
          port: server.port,
          currentIp: server.ipLocal ?? server.ipPublic ?? '',
          token: server.token,
        };
      });
      setIsServerReachable(true);
      setAddressForServerApi(server.ipLocal ?? server.ipPublic ?? '', server.port);
      setServerSearchFailed(false);
      await AsyncStorageFunctions.storeServerInfo({
        ipLocal: server.ipLocal,
        ipPublic: server.ipPublic,
        port: server.port,
        token: server.token,
      });
    },
    [setIsServerReachable, setServerNetwork, setServerSearchFailed],
  );

  return { setReachableServer };
}

function setAddressForServerApi(ip: string, port: string) {
  SetPath(`http://${ip}:${port}`);
}
