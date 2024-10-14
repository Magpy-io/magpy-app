import { useCallback } from 'react';

import { useServerQueries } from '~/Hooks/useServerQueries';

import { useLocalAccountContextInternal } from './LocalAccountContext';

export function useLocalAccountContextFunctions() {
  const { serverNameState, usernameState } = useLocalAccountContextInternal();

  const [, , setServerName, clearServerName] = serverNameState;
  const [, , setUsername, clearUsername] = usernameState;

  const { GetServerInfoPost } = useServerQueries();

  const updateLocalAccountDetails = useCallback(async () => {
    const ret = await GetServerInfoPost({});

    if (!ret.ok) {
      throw new Error('Error while getting server info, ' + JSON.stringify(ret));
    }

    console.log(ret);

    const serverName = ret.data.serverName;
    const username = ret.data.ownerLocal?.name;

    setServerName(serverName);

    if (username) {
      setUsername(username);
    }
  }, [setServerName, setUsername, GetServerInfoPost]);

  const forgetServerLocal = useCallback(() => {
    clearServerName();
    clearUsername();
  }, [clearServerName, clearUsername]);

  return {
    setServerName,
    setUsername,
    updateLocalAccountDetails,
    forgetServerLocal,
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
