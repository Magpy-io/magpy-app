import { storeIsUsingLocalAccount } from '~/Helpers/AsyncStorage';

import { useLocalAccountContext, useLocalAccountContextSetters } from './LocalAccountContext';

export function useLocalAccountFunctions() {
  const { isLocalAccount } = useLocalAccountContext();
  const { setIsLocalAccount } = useLocalAccountContextSetters();

  const getUsingLocalAccount = function () {
    return isLocalAccount;
  };

  const setUsingLocalAccount = async function (usingLocalAccount: boolean) {
    setIsLocalAccount(usingLocalAccount);
    await storeIsUsingLocalAccount(usingLocalAccount);
  };

  return { getUsingLocalAccount, setUsingLocalAccount };
}
