import { useCallback } from 'react';

import { GetServerInfo } from '~/Helpers/ServerQueries';

import { useLocalAccountContextInternal } from './LocalAccountContext';

export function useLocalAccountContextFunctions() {
  const { serverNameState, usernameState } = useLocalAccountContextInternal();

  const [, , setServerName] = serverNameState;
  const [, , setUsername] = usernameState;

  const updateLocalAccountDetails = useCallback(async () => {
    const ret = await GetServerInfo.Post({});

    if (!ret.ok) {
      console.log('Error while getting server info', ret);
      return;
    }

    console.log(ret);

    const serverName = ret.data.serverName;
    const username = ret.data.ownerLocal?.name;

    setServerName(serverName);

    if (username) {
      setUsername(username);
    }
  }, [setServerName, setUsername]);

  return {
    setServerName,
    setUsername,
    updateLocalAccountDetails,
  };
}

export function useLocalAccountContext() {
  const { serverNameState, usernameState } = useLocalAccountContextInternal();

  const [serverName] = serverNameState;
  const [username] = usernameState;

  return {
    serverName,
    username,
  };
}
