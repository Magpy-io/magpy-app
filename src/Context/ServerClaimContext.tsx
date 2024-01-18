import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {Types, GetMyServerInfo} from '~/Helpers/BackendQueries';
import {useAuthContext} from './AuthContext';
import {ClaimServer, GetToken, SetPath} from '~/Helpers/ServerQueries';

import useLocalServers, {Server} from '~/Hooks/useLocalServers';

type ContextType = {
    server?: Types.ServerType;
    hasServer: boolean;
    claimServer: (path: string) => Promise<void>;
    localServers: Server[];
    isScanning: boolean;
    refreshData: () => void;
};

const ServerClaimContext = createContext<ContextType | undefined>(undefined);

const ServerClaimProvider = ({children}: {children: any}) => {
    const {token} = useAuthContext();
    const [server, setServer] = useState<Types.ServerType>();
    const [hasServer, setHasServer] = useState<boolean>(false);

    const {localServers, isScanning, refreshData} = useLocalServers();

    useEffect(() => {
        async function GetServer() {
            try {
                const serverInfo = await GetMyServerInfo.Post();
                if (serverInfo.ok) {
                    setServer(serverInfo.data.server);
                    setHasServer(true);
                } else {
                    setHasServer(false);
                }
            } catch (e) {
                console.log('Error: GetMyServerInfo backend request failed');
            }
        }
        if (token) {
            GetServer();
        }
    }, [token]);

    async function claimServer(path: string) {
        if (!token) {
            return;
        }

        SetPath(path);
        try {
            const ret = await ClaimServer.Post({userToken: token});
            console.log('Claim Server ret', ret);
            if (ret.ok) {
                const serverInfo = await GetMyServerInfo.Post();
                console.log('Server Info', serverInfo);
                if (serverInfo.ok) {
                    setServer(serverInfo.data.server);
                    setHasServer(true);
                }
            }
        } catch (err) {
            console.log('Claim Server Error', err);
        }
    }

    const value = {
        hasServer: hasServer,
        server: server,
        claimServer: claimServer,
        localServers: localServers,
        isScanning: isScanning,
        refreshData: refreshData,
    };
    return <ServerClaimContext.Provider value={value}>{children}</ServerClaimContext.Provider>;
};

function useServerClaimContext() {
    const context = useContext(ServerClaimContext);
    if (!context)
        throw Error('useServerClaimContext can only be used inside an ServerProvider');
    return context;
}

export {ServerClaimProvider, useServerClaimContext};
