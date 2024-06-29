import { useLocalAccountContextInternal } from './LocalAccountContext';

export function useLocalAccountContextFunctions() {
  const { serverNameState, usernameState } = useLocalAccountContextInternal();

  const [, , setServerName] = serverNameState;
  const [, , setUsername] = usernameState;

  return {
    setServerName,
    setUsername,
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
