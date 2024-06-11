import React, { ReactNode, useEffect } from 'react';

import { getLocalAccountServerInfo } from '~/Helpers/AsyncStorage';
import { TokenManager, WhoAmI } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';

import { useLocalAccountContextSettersInternal } from './LocalAccountContext';

type PropsType = {
  children: ReactNode;
};

export const LocalAccountEffects: React.FC<PropsType> = props => {
  const { setServerIp, setServerPort, setServerToken } =
    useLocalAccountContextSettersInternal();

  useEffect(() => {
    async function loadIsLocalAccountContext() {
      const localAccountServerInfo = await getLocalAccountServerInfo();

      let serverFound = false;
      if (localAccountServerInfo.serverToken) {
        try {
          console.log(
            'trying ',
            localAccountServerInfo.serverIp,
            localAccountServerInfo.serverPort,
            ' with stored token',
          );
          TokenManager.SetUserToken(localAccountServerInfo.serverToken);
          const res = await WhoAmI.Post(
            {},
            {
              path: `http://${localAccountServerInfo.serverIp}:${localAccountServerInfo.serverPort}`,
            },
          );
          console.log(res);
          if (res.ok) {
            console.log('Server found');
            serverFound = true;
          }
        } catch (e) {
          console.log('Error: TryServer', e);
          if (e instanceof ErrorServerUnreachable) {
            console.log('Server unreachable');
          }
        }
      }

      setServerIp(localAccountServerInfo.serverIp);
      setServerPort(localAccountServerInfo.serverPort);

      if (serverFound) {
        setServerToken(localAccountServerInfo.serverToken);
      }
    }

    loadIsLocalAccountContext().catch(console.log);
  }, [setServerIp, setServerPort, setServerToken]);

  return props.children;
};
