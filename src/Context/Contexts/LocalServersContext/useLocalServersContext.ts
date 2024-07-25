import { useCallback, useRef } from 'react';

import { isIP } from 'validator';

import { serverMdnsPrefix } from '~/Config/config';
import { MdnsServiceModule, Service } from '~/NativeModules/MdnsServiceModule';

import {
  Server,
  useLocalServersContext,
  useLocalServersContextSetters,
} from './LocalServersContext';

export function useLocalServersFunctions() {
  const localServersContextSetters = useLocalServersContextSetters();
  const localServersContext = useLocalServersContext();

  const { isScanning, localServers } = localServersContext;
  const { setLocalServers } = localServersContextSetters;

  const isScanningRef = useRef(isScanning);
  isScanningRef.current = isScanning;

  const localServersRef = useRef(localServers);
  localServersRef.current = localServers;

  const refreshData = useCallback(() => {
    if (isScanningRef.current) {
      MdnsServiceModule.stop();
    }
    setLocalServers([]);
    MdnsServiceModule.scan('http', 'tcp', 'local.');
    setTimeout(() => {
      MdnsServiceModule.stop();
    }, 5000);
  }, [isScanningRef, setLocalServers]);

  const stopSearch = useCallback(() => {
    MdnsServiceModule.stop();
  }, []);

  const searchAsync = useCallback(async () => {
    if (!isScanningRef.current) {
      setLocalServers([]);
      MdnsServiceModule.scan('http', 'tcp', 'local.');
    }

    return new Promise((resolve: (value: Server[]) => void) => {
      setTimeout(() => {
        MdnsServiceModule.stop();
        resolve(localServersRef.current);
      }, 2000);
    });
  }, [setLocalServers, localServersRef]);

  const addService = useCallback(
    (service: Service) => {
      if (service.name.startsWith(serverMdnsPrefix) && service.addresses[0]) {
        setLocalServers(oldServers => {
          const newServers = [...oldServers];

          const discoveredServers = service.addresses
            .map(address => {
              if (!isIP(address, '4')) {
                return null;
              }
              return {
                name: service.name.replace(serverMdnsPrefix, ''),
                ip: address,
                port: service.port.toString(),
              };
            })
            .filter(v => v != null);

          discoveredServers.forEach(server => {
            if (!oldServers.find(s => s.ip == server.ip && s.port == server.port)) {
              newServers.push(server);
            }
          });
          return newServers;
        });
      }
    },
    [setLocalServers],
  );

  return {
    refreshData,
    stopSearch,
    searchAsync,
    addService,
  };
}
