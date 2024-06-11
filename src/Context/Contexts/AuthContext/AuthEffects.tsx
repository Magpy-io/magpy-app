import React, { ReactNode, useEffect } from 'react';

import { getStoredToken } from '~/Helpers/AsyncStorage';
import { TokenManager, WhoAmI } from '~/Helpers/BackendQueries';

import { useMainContext } from '../MainContext';
import { useAuthContextSetters } from './AuthContext';

type PropsType = {
  children: ReactNode;
};

export const AuthEffects: React.FC<PropsType> = props => {
  const authContextSetters = useAuthContextSetters();

  const { isUsingLocalAccount, isUsingLocalAccountLoaded } = useMainContext();

  const { setUser, setToken, setLoading } = authContextSetters;

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
    if (isUsingLocalAccountLoaded && isUsingLocalAccount == false) {
      retrieveToken().catch(console.log);
    }
  }, [setLoading, setToken, setUser, isUsingLocalAccount, isUsingLocalAccountLoaded]);

  return props.children;
};
