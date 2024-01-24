import { useMainContext } from '~/Context/MainContextProvider';

export function useServerContext() {
  const { serverData } = useMainContext();

  return serverData;
}

export function useServerFunctions() {
  return {};
}
