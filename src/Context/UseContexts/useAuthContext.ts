import { useMainContext } from '~/Context/MainContextProvider';
import { clearAll, storeToken } from '~/Helpers/AsyncStorage';
import { TokenManager, WhoAmI } from '~/Helpers/BackendQueries';

export function useAuthFunctions() {
  const { authData } = useMainContext();
  const { setUser, setToken } = authData;

  const authenticate = async function () {
    const token = TokenManager.GetUserToken();
    console.log('Authenticate, getToken', token);
    const ret = await WhoAmI.Post();
    console.log('Authenticate, whoAmI', ret);
    if (ret.ok) {
      await storeToken(token);
      setToken(token);
      setUser(ret.data.user);
    }
  };

  const logout = async function () {
    setUser(null);
    setToken(null);
    await clearAll();
    TokenManager.SetUserToken('');
  };

  return { authData, authenticate, logout };
}

export function useAuthContext() {
  const { authData } = useMainContext();

  return authData;
}
