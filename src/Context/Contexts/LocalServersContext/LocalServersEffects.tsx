import React, { ReactNode, useEffect } from 'react';

import { serverMdnsPrefix } from '~/Config/config';

import { useLocalServersContextSetters, zeroconf } from './LocalServersContext';

type PropsType = {
  children: ReactNode;
};

export const LocalServersEffects: React.FC<PropsType> = props => {
  const localServersContextSetters = useLocalServersContextSetters();

  const { setLocalServers, setIsScanning } = localServersContextSetters;

  useEffect(() => {
    zeroconf.on('start', () => {
      setIsScanning(true);
    });
    zeroconf.on('stop', () => {
      setIsScanning(false);
    });
    zeroconf.on('resolved', service => {
      if (service.name.startsWith(serverMdnsPrefix) && service.addresses[0]) {
        setLocalServers(oldServers => {
          return [
            ...oldServers,
            {
              name: service.name.replace(serverMdnsPrefix, ''),
              ip: service.addresses[0],
              port: service.port.toString(),
            },
          ];
        });
      }
    });
    zeroconf.on('error', err => {
      setIsScanning(false);
      console.log('[Error]', err);
    });
    return () => {
      zeroconf.removeDeviceListeners();
    };
  }, [setIsScanning, setLocalServers]);

  return props.children;
};
