import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { getAddressInfo, storeAddressInfo } from '~/Helpers/AsyncStorage';
import { GetToken, SetPath } from '~/Helpers/ServerQueries';
import { Server } from '~/Hooks/useLocalServers';

import { useAuthContext } from './AuthContext';
import { useServerClaimContext } from './ServerClaimContext';

type ContextType = {
  isServerReachable: boolean;
  ipLocal: string | null;
  ipPublic: string | null;
  port: string | null;
};

const ServerContext = createContext<ContextType | undefined>(undefined);

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

const ServerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useAuthContext();
  const [isServerReachable, setIsServerReachable] = useState(false);
  const [ipLocal, setIpLocal] = useState<string | null>(null);
  const [ipPublic, setIpPublic] = useState<string | null>(null);
  const [port, setPort] = useState<string | null>(null);
  const { server, localServers, isScanning } = useServerClaimContext();

  console.log('ServerContext');

  useEffect(() => {
    async function core() {
      const res = await getAddressInfo();
      if (res) {
        setIpLocal(res.ipLocal);
        setIpPublic(res.ipPublic);
        setPort(res.port);
      }
    }
    core().catch(console.log);
  }, []);

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
  }, [isServerReachable, token, ipLocal, port]);

  useEffect(() => {
    async function FindServerAddressFromBackend(token: string) {
      // I try the local Ip given by backend
      if (server) {
        console.log('Trying address from server');
        const res = await TryServerAddress(server.ipPrivate, server.port, token);
        if (res) {
          setIpLocal(server.ipPrivate);
          setPort(server.port);
          await storeAddressInfo({ ipLocal: server.ipPrivate, port: server.port });
          setIsServerReachable(true);
        }
      }
    }
    if (!isServerReachable && !!token) {
      FindServerAddressFromBackend(token).catch(console.log);
    }
  }, [server, isServerReachable, token]);

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
        setIpLocal(myPotentialServer.server.ip);
        setPort(myPotentialServer.server.port);
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
  }, [isServerReachable, token, isScanning, localServers]);

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

  const value = {
    ipLocal: ipLocal,
    ipPublic: ipPublic,
    isServerReachable: isServerReachable,
    port: port,
  };
  return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};

function useServerContext() {
  const context = useContext(ServerContext);
  if (!context) {throw Error('useServerContext can only be used inside an AuthProvider');}
  return context;
}

export { ServerProvider, useServerContext };
