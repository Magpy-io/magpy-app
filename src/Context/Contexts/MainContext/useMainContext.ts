import { useCallback } from 'react';

import { useMainContextInner } from './MainContext';

export function useMainContextFunctions() {
  const {
    isNewUserState,
    isUsingLocalAccountState,
    askedForNotificationPermissionBeforeState,
  } = useMainContextInner();

  const [, , setIsNewUser, clearIsNewUser] = isNewUserState;
  const [, , setIsUsingLocalAccount, clearIsUsingLocalAccount] = isUsingLocalAccountState;
  const [
    ,
    ,
    setAskedForNotificationPermissionBefore,
    clearAskedForNotificationPermissionBefore,
  ] = askedForNotificationPermissionBeforeState;

  const clearContext = useCallback(() => {
    clearIsNewUser();
    clearIsUsingLocalAccount();
    clearAskedForNotificationPermissionBefore();
  }, [clearIsNewUser, clearIsUsingLocalAccount, clearAskedForNotificationPermissionBefore]);

  return {
    setIsNewUser,
    setIsUsingLocalAccount,
    setAskedForNotificationPermissionBefore,
    clearContext,
  };
}

export function useMainContext() {
  const {
    isNewUserState,
    isUsingLocalAccountState,
    askedForNotificationPermissionBeforeState,
  } = useMainContextInner();

  const [isNewUser, isNewUserLoaded] = isNewUserState;
  const [isUsingLocalAccount, isUsingLocalAccountLoaded] = isUsingLocalAccountState;
  const [askedForNotificationPermissionBefore] = askedForNotificationPermissionBeforeState;

  const isContextLoaded = isNewUserLoaded && isUsingLocalAccountLoaded;

  return {
    isNewUserLoaded,
    isNewUser,
    isUsingLocalAccount,
    isUsingLocalAccountLoaded,
    isContextLoaded,
    askedForNotificationPermissionBefore,
  };
}
