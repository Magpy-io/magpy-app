import { useCallback, useRef } from 'react';

import { ServerDiscovery } from '~/Helpers/ServerDiscovery';

import {
  Server,
  useLocalServersContext,
  useLocalServersContextSetters,
} from './LocalServersContext';

const serverDiscovery = new ServerDiscovery();

export function useLocalServersFunctions() {
  const localServersContextSetters = useLocalServersContextSetters();
  const localServersContext = useLocalServersContext();

  const { isScanning, localServers } = localServersContext;
  const { setLocalServers, setIsScanning } = localServersContextSetters;

  const lastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isScanningRef = useRef(isScanning);
  isScanningRef.current = isScanning;

  const localServersRef = useRef(localServers);
  localServersRef.current = localServers;

  const refreshData = useCallback(() => {
    if (serverDiscovery.state == 'starting') {
      return;
    }

    if (serverDiscovery.state == 'listening') {
      if (lastTimeoutRef.current != null) {
        clearTimeout(lastTimeoutRef.current);
      }
      setIsScanning(false);
      serverDiscovery.stop();
    }

    if (serverDiscovery.state != 'stopped') {
      return;
    }

    setLocalServers([]);
    setIsScanning(true);
    serverDiscovery
      .launchDiscovery(server => {
        setLocalServers(oldServers => {
          const newServers = [...oldServers];

          if (!oldServers.find(s => s.ip == server.ip && s.port == server.port)) {
            newServers.push(server);
          }
          return newServers;
        });
      })
      .then(() => {
        lastTimeoutRef.current = setTimeout(() => {
          setIsScanning(false);
          serverDiscovery.stop();
        }, 3000);
      })
      .catch(console.log);
  }, [setLocalServers, setIsScanning]);

  const searchAsync = useCallback(async () => {
    if (serverDiscovery.state == 'starting') {
      return [];
    }

    if (serverDiscovery.state == 'listening') {
      if (lastTimeoutRef.current != null) {
        clearTimeout(lastTimeoutRef.current);
      }
      setIsScanning(false);
      serverDiscovery.stop();
    }

    if (serverDiscovery.state != 'stopped') {
      return [];
    }

    setLocalServers([]);
    setIsScanning(true);
    await serverDiscovery.launchDiscovery(server => {
      setLocalServers(oldServers => {
        const newServers = [...oldServers];

        if (!oldServers.find(s => s.ip == server.ip && s.port == server.port)) {
          newServers.push(server);
        }
        return newServers;
      });
    });

    return new Promise((res: (servers: Server[]) => void) => {
      lastTimeoutRef.current = setTimeout(() => {
        setIsScanning(false);
        serverDiscovery.stop();
        res(localServersRef.current);
      }, 1000);
    });
  }, [setLocalServers, setIsScanning]);

  return {
    refreshData,
    searchAsync,
  };
}
