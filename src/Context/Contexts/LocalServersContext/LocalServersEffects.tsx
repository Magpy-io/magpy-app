import React, { ReactNode, useEffect } from 'react';

import { serverMdnsPrefix } from '~/Config/config';
import { MdnsServiceEvents } from '~/NativeModules/MdnsServiceModule';

import { useLocalServersContextSetters } from './LocalServersContext';

type PropsType = {
  children: ReactNode;
};

export const LocalServersEffects: React.FC<PropsType> = props => {
  const localServersContextSetters = useLocalServersContextSetters();

  const { setLocalServers, setIsScanning } = localServersContextSetters;

  useEffect(() => {
    const subStart = MdnsServiceEvents.subscribeOnSearchStarted(() => {
      setIsScanning(true);
    });

    const subStop = MdnsServiceEvents.subscribeOnSearchStopped(() => {
      setIsScanning(false);
    });

    const subResolved = MdnsServiceEvents.subscribeOnServiceResolved(service => {
      if (service.name.startsWith(serverMdnsPrefix) && service.addresses[0]) {
        setLocalServers(oldServers => {
          return [
            ...oldServers,
            ...service.addresses.map(address => {
              return {
                name: service.name.replace(serverMdnsPrefix, ''),
                ip: address,
                port: service.port.toString(),
              };
            }),
          ];
        });
      }
    });

    return () => {
      subStart.remove();
      subStop.remove();
      subResolved.remove();
    };
  }, [setIsScanning, setLocalServers]);

  return props.children;
};
