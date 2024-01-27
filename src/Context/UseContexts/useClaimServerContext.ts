import { useMainContext } from '~/Context/MainContextProvider';
import { GetMyServerInfo } from '~/Helpers/BackendQueries';
import { ClaimServer } from '~/Helpers/ServerQueries';

export function useServerClaimFunctions() {
  const { serverClaimData, authData } = useMainContext();
  const { setServer, setHasServer } = serverClaimData;
  const { token } = authData;

  const claimServer = async (path: string) => {
    if (!token) {
      return;
    }

    try {
      const ret = await ClaimServer.Post({ userToken: token }, { path: path });
      console.log('Claim Server ret with token', token, ret);
      if (ret.ok) {
        const serverInfo = await GetMyServerInfo.Post();
        console.log('Server Info', serverInfo);
        if (serverInfo.ok) {
          setServer(serverInfo.data.server);
          setHasServer(true);
        }
      }
    } catch (err) {
      console.log('Claim Server Error', err);
    }
  };

  return { claimServer };
}

export function useServerClaimContext() {
  const { serverClaimData } = useMainContext();

  return serverClaimData;
}
