import { storeIsUsingLocalAccount } from '~/Helpers/AsyncStorage';

import {
  useLocalAccountContextInternal,
  useLocalAccountContextSettersInternal,
} from './LocalAccountContext';

export function useLocalAccountFunctions() {
  const { setIsLocalAccount } = useLocalAccountContextSettersInternal();

  const setUsingLocalAccount = async function (usingLocalAccount: boolean) {
    setIsLocalAccount(usingLocalAccount);
    await storeIsUsingLocalAccount(usingLocalAccount);
  };

  return { setUsingLocalAccount };
}

export function useLocalAccountContext() {
  const { isLocalAccount, serverIp, serverPort, serverToken } =
    useLocalAccountContextInternal();

  return {
    isLocalAccountLoaded: isLocalAccount != null,
    isLocalAccount,
    serverIp,
    serverPort,
    serverToken,
  };
}
