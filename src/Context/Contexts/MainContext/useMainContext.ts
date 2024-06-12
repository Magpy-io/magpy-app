import { useCallback } from 'react';

import { useMainContextInner } from './MainContext';

export function useMainContextFunctions() {
  const { isNewUserState, isUsingLocalAccountState } = useMainContextInner();

  const [, , setIsNewUser, clearIsNewUser] = isNewUserState;
  const [, , setIsUsingLocalAccount, clearIsUsingLocalAccount] = isUsingLocalAccountState;

  const clearContext = useCallback(() => {
    clearIsNewUser();
    clearIsUsingLocalAccount();
  }, [clearIsNewUser, clearIsUsingLocalAccount]);

  return {
    setIsNewUser,
    setIsUsingLocalAccount,
    clearContext,
  };
}

export function useMainContext() {
  const { isNewUserState, isUsingLocalAccountState } = useMainContextInner();

  const [isNewUser, isNewUserLoaded] = isNewUserState;
  const [isUsingLocalAccount, isUsingLocalAccountLoaded] = isUsingLocalAccountState;

  const isContextLoaded = isNewUserLoaded && isUsingLocalAccountLoaded;

  return {
    isNewUserLoaded,
    isNewUser,
    isUsingLocalAccount,
    isUsingLocalAccountLoaded,
    isContextLoaded,
  };
}
