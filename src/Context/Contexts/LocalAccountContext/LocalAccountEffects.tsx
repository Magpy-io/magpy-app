import React, { ReactNode, useEffect } from 'react';

import { getIsUsingLocalAccount, getLocalAccountServerInfo } from '~/Helpers/AsyncStorage';

import { useLocalAccountContextSettersInternal } from './LocalAccountContext';

type PropsType = {
  children: ReactNode;
};

export const LocalAccountEffects: React.FC<PropsType> = props => {
  const { setIsLocalAccount, setServerIp, setServerPort, setServerToken } =
    useLocalAccountContextSettersInternal();

  useEffect(() => {
    async function loadIsLocalAccountContext() {
      const isLocalAccountStored = await getIsUsingLocalAccount();
      const localAccountServerInfo = await getLocalAccountServerInfo();

      setIsLocalAccount(isLocalAccountStored ?? false);
      setServerIp(localAccountServerInfo.serverIp);
      setServerPort(localAccountServerInfo.serverPort);
      setServerToken(localAccountServerInfo.serverToken);
    }

    loadIsLocalAccountContext().catch(console.log);
  }, [setIsLocalAccount, setServerIp, setServerPort, setServerToken]);

  return props.children;
};
