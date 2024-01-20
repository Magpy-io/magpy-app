import { createContext, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { clearAll, getStoredToken, storeToken } from '~/Helpers/AsyncStorage';
import { TokenManager, Types, WhoAmI } from '~/Helpers/BackendQueries';

type ContextType = {
  authenticate: () => Promise<void>;
  loading: boolean;
  token: string | null;
  logout: () => Promise<void>;
  user?: Types.UserType | null;
};

const AuthContext = createContext<ContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<Types.UserType | null>();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

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

    retrieveToken();
  }, []);

  const authenticate = async function () {
    const token = TokenManager.GetUserToken();
    console.log('Authenticate, getToken', token);
    const ret = await WhoAmI.Post();
    console.log('Authenticate, whoAmI', ret);
    if (ret.ok) {
      storeToken(token);
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

  const value = {
    authenticate: authenticate,
    user: user,
    token: token,
    loading: loading,
    logout: logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw Error('useAuthContext can only be used inside an AuthProvider');
  return context;
}

export { AuthProvider, useAuthContext };
