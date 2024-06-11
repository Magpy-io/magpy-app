import { useMainContextInner } from './MainContext';

export function useMainContextFunctions() {
  const { isNewUserState, isUsingLocalAccountState } = useMainContextInner();

  return {
    loadIsNewUser: isNewUserState.loadValue,
    setIsNewUser: isNewUserState.setValuePersistent,
    loadIsUsingLocalAccount: isUsingLocalAccountState.loadValue,
    setIsUsingLocalAccount: isUsingLocalAccountState.setValuePersistent,
  };
}

export function useMainContext() {
  const { isNewUserState, isUsingLocalAccountState } = useMainContextInner();

  return {
    isNewUserLoaded: isNewUserState.isLoaded,
    isNewUser: isNewUserState.value,
    isUsingLocalAccount: isUsingLocalAccountState.value,
    isUsingLocalAccountLoaded: isUsingLocalAccountState.isLoaded,
  };
}
