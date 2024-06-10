import { useMainContextInner } from './MainContext';

export function useMainContextFunctions() {
  const { isNewUserState } = useMainContextInner();

  return {
    loadIsNewUser: isNewUserState.loadValue,
    setIsNewUser: isNewUserState.setValuePersistent,
  };
}

export function useMainContext() {
  const { isNewUserState } = useMainContextInner();

  return {
    isNewUserLoaded: isNewUserState.isLoaded,
    isNewUser: isNewUserState.value,
  };
}
