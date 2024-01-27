import { useCallback, useRef } from 'react';

import { zeroconf } from '~/Context/ContextSlices/LocalServersContext';
import { useMainContext } from '~/Context/MainContextProvider';

export function useLocalServersFunctions() {
  const { localServersData } = useMainContext();
  const { isScanning, setLocalServers } = localServersData;

  const isScanningRef = useRef(isScanning);
  isScanningRef.current = isScanning;

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

  return {
    refreshData,
    stopSearch,
  };
}

export function useLocalServersContext() {
  const { localServersData } = useMainContext();

  return localServersData;
}
