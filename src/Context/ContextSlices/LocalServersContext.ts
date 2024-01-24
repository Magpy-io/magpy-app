import { useEffect, useState } from 'react';

import Zeroconf from 'react-native-zeroconf';

import { serverMdnsPrefix } from '~/Config/config';

import { useMainContext } from '../MainContextProvider';

export const zeroconf = new Zeroconf();

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type LocalServersDataType = {
  localServers: Server[];
  setLocalServers: SetStateType<Server[]>;
  isScanning: boolean;
  setIsScanning: SetStateType<boolean>;
};

export type Server = { name: string; ip: string; port: string };

export function useLocalServersData(): LocalServersDataType {
  const [localServers, setLocalServers] = useState<Server[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  return { localServers, setLocalServers, isScanning, setIsScanning };
}

export function useLocalServersEffect() {
  const { localServersData } = useMainContext();
  const { setIsScanning, setLocalServers } = localServersData;

  useEffect(() => {
    zeroconf.on('start', () => {
      setIsScanning(true);
    });
    zeroconf.on('stop', () => {
      setIsScanning(false);
    });
    zeroconf.on('resolved', service => {
      console.log('resolved', service);
      if (service.name.startsWith(serverMdnsPrefix)) {
        setLocalServers(oldServers => {
          return [
            ...oldServers,
            {
              name: service.name.replace(serverMdnsPrefix, ''),
              ip: service.host,
              port: service.port.toString(),
            },
          ];
        });
      }
    });
    zeroconf.on('error', err => {
      console.log('[Error]', err);
    });
    return () => {
      zeroconf.removeDeviceListeners();
    };
  }, [setIsScanning, setLocalServers]);
}
