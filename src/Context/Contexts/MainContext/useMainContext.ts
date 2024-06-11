import { useMainContextInner } from './MainContext';

export function useMainContextFunctions() {
  const { isNewUserState, isUsingLocalAccountState } = useMainContextInner();

  const [, , setIsNewUser] = isNewUserState;
  const [, , setIsUsingLocalAccount] = isUsingLocalAccountState;

  return {
    setIsNewUser,
    setIsUsingLocalAccount,
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
