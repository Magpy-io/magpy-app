import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {GetUserToken, ServerType, getMyServerInfoPost} from '~/Helpers/backendImportedQueries';
import {useAuthContext} from './AuthContext';
import {ClaimServerPost, SetPath} from '~/Helpers/serverImportedQueries';

type ContextType = {
    hasServer: boolean;
    server?: ServerType;
    claimServer: (path: string) => Promise<void>;
};

const ServerContext = createContext<ContextType | undefined>(undefined);

const ServerProvider = ({children}: {children: any}) => {
    const {isAuthenticated} = useAuthContext();
    const [server, setServer] = useState<ServerType>();
    const hasServer = useMemo(() => server != null, [server]);

    useEffect(() => {
        async function GetServer() {
            const ret = await getMyServerInfoPost();
            if (ret.ok) {
                setServer(ret.data.server);
            }
        }
        if (isAuthenticated) {
            GetServer();
        }
    }, []);

    async function claimServer(path: string) {
        SetPath(path);
        const token = GetUserToken();
        try {
            const ret = await ClaimServerPost({userToken: token});
            console.log('Claim Server ret', ret);
            if (ret.ok) {
                const serverInfo = await getMyServerInfoPost();
                console.log('Server Info', serverInfo);
                if (serverInfo.ok) {
                    setServer(serverInfo.data.server);
                }
            }
        } catch (err) {
            console.log('Claim Server Error', err);
        }
    }

    const value = {hasServer: hasServer, server: server, claimServer: claimServer};
    return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};

function useServerContext() {
    const context = useContext(ServerContext);
    if (!context) throw Error('useServerContext can only be used inside an AuthProvider');
    return context;
}

export {ServerProvider, useServerContext};
