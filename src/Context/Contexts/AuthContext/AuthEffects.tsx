import React, { ReactNode, useEffect, useState } from 'react';

import { TokenManager } from '~/Helpers/BackendQueries';

import { useMainContext } from '../MainContext';
import { useAuthContext, useAuthContextFunctions } from './useAuthContext';

type PropsType = {
  children: ReactNode;
};

export const AuthEffects: React.FC<PropsType> = props => {
  const [firstTime, setFirstTime] = useState(true);
  const { setLoading, authenticate } = useAuthContextFunctions();
  const { token, isTokenLoaded } = useAuthContext();

  const { isUsingLocalAccount, isUsingLocalAccountLoaded } = useMainContext();

  useEffect(() => {
    async function retrieveToken() {
      if (token) {
        TokenManager.SetUserToken(token);

        await authenticate();
      }
    }

    if (!firstTime) {
      return;
    }

    if (isTokenLoaded && isUsingLocalAccountLoaded) {
      setFirstTime(false);

      if (isUsingLocalAccount) {
        return;
      }

      retrieveToken()
        .then(() => setLoading(false))
        .catch(console.log);
    }
  }, [
    setLoading,
    isUsingLocalAccount,
    isUsingLocalAccountLoaded,
    token,
    authenticate,
    firstTime,
    isTokenLoaded,
  ]);

  return props.children;
};
