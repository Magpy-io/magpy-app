import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useContext, useEffect, useState} from 'react';
import {
    GetUserToken,
    SetPath,
    SetUserToken,
    UserType,
    whoAmIPost,
} from '~/Helpers/backendImportedQueries';

type ContextType = {
    authenticate: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
    token: string | null;
    logout: () => Promise<void>;
    user?: UserType | null;
};

const AuthContext = createContext<ContextType | undefined>(undefined);

const storeToken = async (value: string) => {
    try {
        console.log('Saving token in AsyncStorage', value);
        await AsyncStorage.setItem('authToken', value);
    } catch (e) {
        console.log('Error saving Auth Token in AsyncStorage', e);
    }
};

const getStoredToken = async () => {
    try {
        const value = await AsyncStorage.getItem('authToken');
        if (value !== null) {
            console.log('Getting token from AsyncStorage', value);
            return value;
        }
    } catch (e) {
        console.log('Error reading Auth Token from AsyncStorage', e);
    }
};

const clearAll = async () => {
    try {
        await AsyncStorage.clear();
        console.log('Clearing Auth token from AsyncStorage');
    } catch (e) {
        console.log('Error clearing Auth Token from AsyncStorage', e);
    }
};

const AuthProvider = ({children}: {children: any}) => {
    const [user, setUser] = useState<UserType | null>();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        async function retrieveToken() {
            const t = await getStoredToken();
            if (t) {
                SetUserToken(t);
                try {
                    const ret = await whoAmIPost();
                    console.log('Who am I ret', ret);
                    if (ret.ok) {
                        setUser(ret.data.user);
                        setToken(t);
                        setIsAuthenticated(true);
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
        const token = GetUserToken();
        console.log('Authenticate, getToken', token);
        const ret = await whoAmIPost();
        console.log('Authenticate, whoAmI', ret);
        if (ret.ok) {
            storeToken(token);
            setToken(token);
            setUser(ret.data.user);
            setIsAuthenticated(true);
        }
    };

    const logout = async function () {
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
        await clearAll();
        SetUserToken('');
    };

    const value = {
        authenticate: authenticate,
        isAuthenticated: isAuthenticated,
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

export {AuthProvider, useAuthContext};
