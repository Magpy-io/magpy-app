import { useCallback, useRef } from 'react';

import { MdnsServiceModule } from '~/NativeModules/MdnsServiceModule';

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
    MdnsServiceModule.scan('http', 'tcp', 'local.', '');
    setTimeout(() => {
      MdnsServiceModule.stop();
    }, 5000);
  }, [isScanningRef, setLocalServers]);

  const stopSearch = () => {
    MdnsServiceModule.stop();
  };

  const searchAsync = useCallback(async () => {
    if (isScanningRef.current) {
      MdnsServiceModule.stop();
    }
    setLocalServers([]);
    MdnsServiceModule.scan('http', 'tcp', 'local.', '');

    return new Promise((resolve: (value: Server[]) => void) => {
      setTimeout(() => {
        MdnsServiceModule.stop();
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
