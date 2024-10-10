import { useCallback } from 'react';

import { useMainContextInner } from './MainContext';

export function useMainContextFunctions() {
  const {
    isNewUserState,
    isUsingLocalAccountState,
    neverAskForNotificationPermissionAgainState,
  } = useMainContextInner();

  const [, , setIsNewUser, clearIsNewUser] = isNewUserState;
  const [, , setIsUsingLocalAccount, clearIsUsingLocalAccount] = isUsingLocalAccountState;
  const [
    ,
    ,
    setNeverAskForNotificationPermissionAgain,
    clearNeverAskForNotificationPermissionAgain,
  ] = neverAskForNotificationPermissionAgainState;

  const clearContext = useCallback(() => {
    clearIsNewUser();
    clearIsUsingLocalAccount();
    clearNeverAskForNotificationPermissionAgain();
  }, [clearIsNewUser, clearIsUsingLocalAccount, clearNeverAskForNotificationPermissionAgain]);

  return {
    setIsNewUser,
    setIsUsingLocalAccount,
    setNeverAskForNotificationPermissionAgain,
    clearContext,
  };
}

export function useMainContext() {
  const {
    isNewUserState,
    isUsingLocalAccountState,
    neverAskForNotificationPermissionAgainState,
  } = useMainContextInner();

  const [isNewUser, isNewUserLoaded] = isNewUserState;
  const [isUsingLocalAccount, isUsingLocalAccountLoaded] = isUsingLocalAccountState;
  const [neverAskForNotificationPermissionAgain] = neverAskForNotificationPermissionAgainState;

  const isContextLoaded = isNewUserLoaded && isUsingLocalAccountLoaded;

  return {
    isNewUserLoaded,
    isNewUser,
    isUsingLocalAccount,
    isUsingLocalAccountLoaded,
    isContextLoaded,
    neverAskForNotificationPermissionAgain,
  };
}
