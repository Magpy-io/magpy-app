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
  const { token } = useAuthContext();

  const { isUsingLocalAccount, isUsingLocalAccountLoaded } = useMainContext();

  useEffect(() => {
    async function retrieveToken() {
      if (token) {
        setFirstTime(false);
        setLoading(true);
        TokenManager.SetUserToken(token);

        await authenticate();
      }
      setLoading(false);
    }

    if (isUsingLocalAccountLoaded && isUsingLocalAccount == false && firstTime) {
      retrieveToken().catch(console.log);
    }
  }, [
    setLoading,
    isUsingLocalAccount,
    isUsingLocalAccountLoaded,
    token,
    authenticate,
    firstTime,
  ]);

  return props.children;
};
