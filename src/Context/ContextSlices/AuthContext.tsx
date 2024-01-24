import React, { useEffect, useState } from 'react';

import { getStoredToken } from '~/Helpers/AsyncStorage';
import { TokenManager, Types, WhoAmI } from '~/Helpers/BackendQueries';

import { useMainContext } from '../MainContextProvider';

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
  const { authData } = useMainContext();
  const { setUser, setToken, setLoading } = authData;

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
