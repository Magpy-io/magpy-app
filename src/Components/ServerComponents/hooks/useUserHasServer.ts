import { useMainContext } from '~/Context/Contexts/MainContext';
import { useServerClaimContext } from '~/Context/Contexts/ServerClaimContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';

export function useUserHasServer() {
  const { serverNetwork } = useServerContext();
  const { server } = useServerClaimContext();
  const { isUsingLocalAccount } = useMainContext();

  const hasServerLocal = isUsingLocalAccount && !!serverNetwork;
  const hasServerRemote = !isUsingLocalAccount && !!server;

  return hasServerLocal || hasServerRemote;
}
