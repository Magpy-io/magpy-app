import React, { ReactNode, useEffect } from 'react';

import { serverMdnsPrefix } from '~/Config/config';
import { MdnsServiceModule } from '~/NativeModules/MdnsServiceModule';
import { NativeEventEmitterWrapper } from '~/NativeModules/NativeModulesEventNames';

import { useLocalServersContextSetters } from './LocalServersContext';

type PropsType = {
  children: ReactNode;
};

export const LocalServersEffects: React.FC<PropsType> = props => {
  const localServersContextSetters = useLocalServersContextSetters();

  const { setLocalServers, setIsScanning } = localServersContextSetters;

  useEffect(() => {
    const emmiter = new NativeEventEmitterWrapper();

    const subStart = emmiter.subscribeOnSearchStarted(() => {
      setIsScanning(true);
    });

    const subStop = emmiter.subscribeOnSearchStopped(() => {
      setIsScanning(false);
    });

    const subResolved = emmiter.subscribeOnServiceResolved(service => {
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

    return () => {
      subStart.remove();
      subStop.remove();
      subResolved.remove();
      MdnsServiceModule.removeDeviceListeners();
    };
  }, [setIsScanning, setLocalServers]);

  return props.children;
};
