import { useCallback, useRef } from 'react';

import {
  Server,
  useLocalServersContext,
  useLocalServersContextSetters,
  zeroconf,
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
      zeroconf.stop();
    }
    setLocalServers([]);
    zeroconf.scan('http', 'tcp', 'local.');
    setTimeout(() => {
      zeroconf.stop();
    }, 5000);
  }, [isScanningRef, setLocalServers]);

  const stopSearch = () => {
    zeroconf.stop();
  };

  const searchAsync = useCallback(async () => {
    if (isScanningRef.current) {
      zeroconf.stop();
    }
    setLocalServers([]);
    zeroconf.scan('http', 'tcp', 'local.');

    return new Promise((resolve: (value: Server[]) => void) => {
      setTimeout(() => {
        zeroconf.stop();
        resolve(localServersRef.current);
      }, 1000);
    });
  }, [setLocalServers, localServersRef]);

  return {
    refreshData,
    stopSearch,
    searchAsync,
  };
}
