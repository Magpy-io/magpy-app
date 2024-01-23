import React, { useEffect, useState } from 'react';

import { clearAll, getStoredToken, storeToken } from '~/Helpers/AsyncStorage';
import { TokenManager, Types, WhoAmI } from '~/Helpers/BackendQueries';

import { useMainContext } from './MainContextProvider';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type AuthDataType = {
  user: Types.UserType | null;
  setUser: SetStateType<Types.UserType | null>;
  loading: boolean;
  setLoading: SetStateType<boolean>;
  token: string | null;
  setToken: SetStateType<string | null>;
};

export function useAuthData(): AuthDataType {
  const [user, setUser] = useState<Types.UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  return { user, setUser, loading, setLoading, token, setToken };
}

export function useAuthDataEffect() {
  const { auth } = useMainContext();
  const { setUser, setToken, setLoading } = auth;

  useEffect(() => {
    async function retrieveToken() {
      const t = await getStoredToken();
      if (t) {
        TokenManager.SetUserToken(t);
        try {
          const ret = await WhoAmI.Post();
          console.log('Who am I ret', ret);
          if (ret.ok) {
            setUser(ret.data.user);
            setToken(t);
          }
        } catch (err) {
          console.log('Error in WhoAmI', err);
        }
      }
      setLoading(false);
    }

    retrieveToken().catch(console.log);
  }, [setLoading, setToken, setUser]);
}

export function useAuth() {
  const { auth } = useMainContext();
  const { setUser, setToken } = auth;

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

  return { authenticate, logout };
}
