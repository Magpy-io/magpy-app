import React, { useEffect, useState } from 'react';

import { Server } from '~/Context/ContextSlices/LocalServersContext';
import { getAddressInfo, storeAddressInfo } from '~/Helpers/AsyncStorage';
import { GetToken, SetPath } from '~/Helpers/ServerQueries';

import { useMainContext } from '../MainContextProvider';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type ServerDataType = {
  isServerReachable: boolean;
  setIsServerReachable: SetStateType<boolean>;
  serverNetwork: ServerNetworkType;
  setServerNetwork: SetStateType<ServerNetworkType>;
};

export type ServerNetworkType = {
  ipLocal: string | null;
  ipPublic: string | null;
  port: string | null;
};

export function useServerData(): ServerDataType {
  const [isServerReachable, setIsServerReachable] = useState(false);
  const [serverNetwork, setServerNetwork] = useState<ServerNetworkType>({
    ipLocal: null,
    ipPublic: null,
    port: null,
  });
  return { isServerReachable, setIsServerReachable, serverNetwork, setServerNetwork };
}

export function useServerEffect() {
  const mainContext = useMainContext();

  const { setServerNetwork, serverNetwork, setIsServerReachable, isServerReachable } =
    mainContext.serverData;
  const { token } = mainContext.authData;

  const { ipLocal, ipPublic, port } = serverNetwork;
  const claimedServer = mainContext.serverClaimData.server;
  const { isScanning, localServers } = mainContext.localServersData;

  useEffect(() => {
    async function core() {
      const res = await getAddressInfo();
      if (res) {
        setServerNetwork({ ipLocal: res.ipLocal, ipPublic: res.ipPublic, port: res.port });
      }
    }
    core().catch(console.log);
  }, [setServerNetwork]);

  useEffect(() => {
    async function FindServerAddressFromAsyncStorage(token: string) {
      // I got ip/port from async storage, I try to connect
      if (ipLocal && port) {
        console.log('Trying Address from Async storage');
        const res = await TryServerAddress(ipLocal, port, token);
        if (res) {
          setIsServerReachable(true);
        }
      }
    }
    if (!isServerReachable && !!token) {
      FindServerAddressFromAsyncStorage(token).catch(console.log);
    }
  }, [isServerReachable, token, ipLocal, port, setIsServerReachable]);

  useEffect(() => {
    async function FindServerAddressFromBackend(token: string) {
      // I try the local Ip given by backend
      if (claimedServer) {
        console.log('Trying address from server');
        const res = await TryServerAddress(claimedServer.ipPrivate, claimedServer.port, token);
        if (res) {
          setServerNetwork({
            ipLocal: claimedServer.ipPrivate,
            ipPublic: ipPublic,
            port: claimedServer.port,
          });

          await storeAddressInfo({
            ipLocal: claimedServer.ipPrivate,
            port: claimedServer.port,
          });
          setIsServerReachable(true);
        }
      }
    }
    if (!isServerReachable && !!token) {
      FindServerAddressFromBackend(token).catch(console.log);
    }
  }, [
    isServerReachable,
    token,
    setServerNetwork,
    ipPublic,
    setIsServerReachable,
    claimedServer,
  ]);

  useEffect(() => {
    async function FindServerAddressFromLocalServers(token: string) {
      // I try local servers scanned
      console.log('Trying address from scanned local servers');
      const results: { result: string | undefined; server: Server }[] = [];
      for (const s of localServers) {
        console.log('Loop', s.ip);
        const r = await TryServerAddress(s.ip, s.port, token);
        results.push({ result: r, server: s });
      }
      const myPotentialServer = results.filter(r => !!r.result)?.[0];
      if (myPotentialServer) {
        setServerNetwork({
          ipLocal: myPotentialServer.server.ip,
          ipPublic: ipPublic,
          port: myPotentialServer.server.port,
        });
        await storeAddressInfo({
          ipLocal: myPotentialServer.server.ip,
          port: myPotentialServer.server.port,
        });
        setIsServerReachable(true);
        SetPath(`http://${myPotentialServer.server.ip}:${myPotentialServer.server.port}`);
      }
    }
    if (!isServerReachable && !!token && !isScanning) {
      FindServerAddressFromLocalServers(token).catch(console.log);
    }
  }, [
    isServerReachable,
    token,
    isScanning,
    localServers,
    setServerNetwork,
    ipPublic,
    setIsServerReachable,
  ]);

  // TODO : make sure this only happens after we tried to find the local ip address
  // useEffect(() => {
  //   async function FindServerPublicAddress() {
  //     // Try public Ip from async storage
  //     if (ipPublic) {
  //       console.log('Trying public ip from async storage');
  //       const res = await TryServerAddress(ipPublic, port, token);
  //       if (res) {
  //         setIsServerReachable(true);
  //         return;
  //       }
  //     }
  //     // Try public Ip from backend
  //     if (server) {
  //       console.log('Trying public ip from backend');
  //       const res = await TryServerAddress(server.ipPublic, server.port, token);
  //       if (res) {
  //         // TODO uncomment this when done
  //         // setIsServerReachable(true);
  //         setIpPublic(server.ipPublic);
  //         setPort(server.port);
  //         storeAddressInfo({
  //           ipPublic: server.ipPublic,
  //           port: server.port,
  //         });
  //       }
  //     }
  //   }
  //   if (!isServerReachable && !!token) {
  //     FindServerPublicAddress();
  //   }
  // }, [isServerReachable, token, server]);
}

async function TryServerAddress(ip: string, port: string, token: string) {
  console.log('Trying address :', ip, port);
  try {
    SetPath(`http://${ip}:${port}`);
    const res = await GetToken.Post({ userToken: token });
    if (res.ok) {
      console.log("Bingo, it's: ", ip, port);
      return res.data;
    }
  } catch (e) {
    console.log('Error: TryServerAddress', e);
  }
}
