import React, { ReactNode, useEffect } from 'react';

import { MdnsServiceEvents } from '~/NativeModules/MdnsServiceModule';

import { useLocalServersContextSetters } from './LocalServersContext';
import { useLocalServersFunctions } from './useLocalServersContext';

type PropsType = {
  children: ReactNode;
};

export const LocalServersEffects: React.FC<PropsType> = props => {
  const { setIsScanning } = useLocalServersContextSetters();

  const { addService } = useLocalServersFunctions();

  useEffect(() => {
    const subStart = MdnsServiceEvents.subscribeOnSearchStarted(() => {
      setIsScanning(true);
    });

    const subStop = MdnsServiceEvents.subscribeOnSearchStopped(() => {
      setIsScanning(false);
    });

    const subResolved = MdnsServiceEvents.subscribeOnServiceResolved(service => {
      addService(service);
    });

    return () => {
      subStart.remove();
      subStop.remove();
      subResolved.remove();
    };
  }, [addService, setIsScanning]);

  return props.children;
};
