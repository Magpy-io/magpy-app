import { removeStoredToken, storeToken } from '~/Helpers/AsyncStorage';
import { TokenManager, WhoAmI } from '~/Helpers/BackendQueries';

import { useAuthContextSetters } from './AuthContext';

export function useAuthFunctions() {
  const authContextSetters = useAuthContextSetters();

  const { setUser, setToken } = authContextSetters;

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
    await removeStoredToken();
    TokenManager.SetUserToken('');
  };

  return { authenticate, logout };
}
