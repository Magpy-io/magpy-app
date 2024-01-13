import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {ServerType, getMyServerInfoPost} from '~/Helpers/backendImportedQueries';
import {useAuthContext} from './AuthContext';

type ContextType = {
    hasServer: boolean;
    server?: ServerType;
};

const ServerContext = createContext<ContextType | undefined>(undefined);

const ServerProvider = ({children}: {children: any}) => {
    const {isAuthenticated} = useAuthContext();
    const [server, setServer] = useState<ServerType>();
    const hasServer = useMemo(() => server != null, []);

    useEffect(() => {
        async function GetServer() {
            const ret = await getMyServerInfoPost();
            if (ret.ok && ret.data.server) {
                setServer(ret.data.server);
            }
        }
        if (isAuthenticated) {
            GetServer();
        }
    }, []);

    const value = {hasServer: hasServer, server: server};
    return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};

function useServerContext() {
    const context = useContext(ServerContext);
    if (!context) throw Error('useServerContext can only be used inside an AuthProvider');
    return context;
}

export {ServerProvider, useServerContext};
