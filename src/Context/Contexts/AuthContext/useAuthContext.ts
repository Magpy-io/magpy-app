import { TokenManager, WhoAmI } from '~/Helpers/BackendQueries';

import { useAuthContextInner, useAuthContextSettersInner } from './AuthContext';

export function useAuthContextFunctions() {
  const { setUser, setLoading } = useAuthContextSettersInner();
  const { tokenState } = useAuthContextInner();

  const [, , setToken] = tokenState;

  const logout = function () {
    setUser(null);
    setToken(null);
    TokenManager.SetUserToken('');
  };

  const authenticate = async function () {
    const token = TokenManager.GetUserToken();
    console.log('Authenticate, getToken', token);
    const ret = await WhoAmI.Post();
    console.log('Authenticate, whoAmI', ret);
    if (ret.ok) {
      setToken(token);
      setUser(ret.data.user);
      return true;
    } else {
      logout();
    }
    return false;
  };

  return { authenticate, logout, setLoading };
}

export function useAuthContext() {
  const { user, tokenState, loading } = useAuthContextInner();

  const [token] = tokenState;

  return { user, loading, token };
}
