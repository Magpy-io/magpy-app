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
    const ret = await WhoAmI.Post();

    if (ret.ok) {
      setToken(token);
      setUser(ret.data.user);
    } else {
      logout();
    }
    return ret.ok;
  };

  return { authenticate, logout, setLoading };
}

export function useAuthContext() {
  const { user, tokenState, loading } = useAuthContextInner();

  const [token, isTokenLoaded] = tokenState;

  return { user, loading, token, isTokenLoaded };
}
