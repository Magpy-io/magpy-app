import { useLocalAccountContextInternal } from './LocalAccountContext';

export function useLocalAccountFunctions() {}

export function useLocalAccountContext() {
  const { serverIp, serverPort, serverToken } = useLocalAccountContextInternal();

  return {
    hasSavedClaimedServer: serverIp != null,
    serverIp,
    serverPort,
    serverToken,
  };
}
