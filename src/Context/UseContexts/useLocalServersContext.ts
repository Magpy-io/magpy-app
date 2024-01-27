import { useCallback, useRef } from 'react';

import { zeroconf } from '~/Context/ContextSlices/LocalServersContext';
import { useMainContext } from '~/Context/MainContextProvider';

export function useLocalServersFunctions() {
  const { localServersData } = useMainContext();
  const { isScanning, setLocalServers, localServers } = localServersData;

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

    return new Promise(resolve => {
      setTimeout(() => {
        zeroconf.stop();
        resolve(localServersRef.current);
      }, 5000);
    });
  }, [setLocalServers, localServersRef]);

  return {
    refreshData,
    stopSearch,
    searchAsync,
  };
}

export function useLocalServersContext() {
  const { localServersData } = useMainContext();

  return localServersData;
}
