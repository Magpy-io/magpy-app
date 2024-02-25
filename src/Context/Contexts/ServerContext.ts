import React, { useCallback, useEffect, useState } from 'react';

import * as AsyncStorageFunctions from '~/Helpers/AsyncStorage';
import { ServerType } from '~/Helpers/BackendQueries/Types';
import { GetToken, SetPath } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';

import { useMainContext } from '../MainContextProvider';
import { useLocalServersFunctions } from '../UseContexts/useLocalServersContext';
import { Server } from './LocalServersContext';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type ServerDataType = {
  isServerReachable: boolean;
  setIsServerReachable: SetStateType<boolean>;
  serverNetwork: ServerNetworkType;
  setServerNetwork: SetStateType<ServerNetworkType>;
  serverSearchFailed: boolean;
  setServerSearchFailed: SetStateType<boolean>;
};

export type ServerNetworkType = {
  ipLocal: string | null;
  ipPublic: string | null;
  port: string | null;
  currentIp: string | null;
};

export function useServerData(): ServerDataType {
  const [isServerReachable, setIsServerReachable] = useState(false);
  const [serverSearchFailed, setServerSearchFailed] = useState(false);
  const [serverNetwork, setServerNetwork] = useState<ServerNetworkType>({
    ipLocal: null,
    ipPublic: null,
    port: null,
    currentIp: null,
  });
  return {
    isServerReachable,
    setIsServerReachable,
    serverNetwork,
    setServerNetwork,
    serverSearchFailed,
    setServerSearchFailed,
  };
}

export function useServerEffect() {
  const mainContext = useMainContext();

  const { searchAsync } = useLocalServersFunctions();

  const { setServerNetwork, setIsServerReachable, setServerSearchFailed } =
    mainContext.serverData;
  const { token } = mainContext.authData;

  const claimedServer = mainContext.serverClaimData.server;

  const setReachableServer = useCallback(
    async (server: { ipLocal?: string; ipPublic?: string; port: string }) => {
      setServerNetwork(s => {
        return {
          ipLocal: server.ipLocal ?? s.ipLocal,
          ipPublic: server.ipPublic ?? s.ipPublic,
          port: server.port,
          currentIp: server.ipLocal ?? server.ipPublic ?? '',
        };
      });
      setIsServerReachable(true);
      setAddressForServerApi(server.ipLocal ?? server.ipPublic ?? '', server.port);
      await AsyncStorageFunctions.storeAddressInfo({
        ipLocal: server.ipLocal,
        ipPublic: server.ipPublic,
        port: server.port,
      });
    },
    [setIsServerReachable, setServerNetwork],
  );

  useEffect(() => {
    async function FindServer(backendToken: string, claimedServer: ServerType) {
      let serverResponded = false;

      // Start search for local mdns servers
      const serversPromise = searchAsync();

      // Try async storage local address
      const AsyncStorageNetwork = await AsyncStorageFunctions.getAddressInfo();
      if (AsyncStorageNetwork.ipLocal && AsyncStorageNetwork.port) {
        serverResponded = await TryServer(
          AsyncStorageNetwork.ipLocal,
          AsyncStorageNetwork.port,
          backendToken,
        );
        if (serverResponded) {
          await setReachableServer({
            ipLocal: AsyncStorageNetwork.ipLocal,
            port: AsyncStorageNetwork.port,
          });
          return;
        } else {
          await AsyncStorageFunctions.storeAddressInfo({ ipLocal: '' });
        }
      }

      // Try backend server local address
      serverResponded = await TryServer(
        claimedServer.ipPrivate,
        claimedServer.port,
        backendToken,
      );

      if (serverResponded) {
        await setReachableServer({
          ipLocal: claimedServer.ipPrivate,
          port: claimedServer.port,
        });
        return;
      }

      // Try discovered servers
      const servers = await serversPromise;

      const serversTriedPromises = servers.map(server => {
        return TryServer(server.ip, server.port, backendToken).then(responded => {
          if (responded) {
            return server;
          } else {
            throw 'NO_RESPONSE';
          }
        });
      });

      let anyServerResponded: Server | undefined;

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

      if (anyServerResponded) {
        await setReachableServer({
          ipLocal: anyServerResponded.ip,
          port: anyServerResponded.port,
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
        if (serverResponded) {
          await setReachableServer({
            ipPublic: AsyncStorageNetwork.ipPublic,
            port: AsyncStorageNetwork.port,
          });
          return;
        } else {
          await AsyncStorageFunctions.storeAddressInfo({ ipPublic: '' });
        }
      }

      // Try backend server public address
      serverResponded = await TryServer(
        claimedServer.ipPublic,
        claimedServer.port,
        backendToken,
      );

      if (serverResponded) {
        await setReachableServer({
          ipPublic: claimedServer.ipPublic,
          port: claimedServer.port,
        });
        return;
      }

      setServerSearchFailed(true);
    }

    if (token && claimedServer) {
      FindServer(token, claimedServer).catch(console.log);
    }
  }, [
    searchAsync,
    setIsServerReachable,
    setServerNetwork,
    token,
    claimedServer,
    setReachableServer,
    setServerSearchFailed,
  ]);
}

function setAddressForServerApi(ip: string, port: string) {
  SetPath(`http://${ip}:${port}`);
}

async function TryServer(ip: string, port: string, token: string) {
  try {
    console.log('trying ', ip, port);
    const res = await GetToken.Post({ userToken: token }, { path: `http://${ip}:${port}` });
    console.log(res);
    if (res.ok) {
      console.log('Server found');
      return true;
    }
    return false;
  } catch (e) {
    if (e instanceof ErrorServerUnreachable) {
      return false;
    }
    console.log('Error: TryServer', e);
    throw e;
  }
}
