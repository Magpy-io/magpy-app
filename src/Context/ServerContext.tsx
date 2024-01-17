import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {Types, GetMyServerInfo} from '~/Helpers/BackendQueries';
import {useAuthContext} from './AuthContext';
import {ClaimServer, GetToken, SetPath} from '~/Helpers/ServerQueries';
import Zeroconf, {Service} from 'react-native-zeroconf';
import {getOnlyOurServers} from '~/Helpers/selectServerHelpers';
import useLocalServers from '~/Hooks/useLocalServers';
const zeroconf = new Zeroconf();

type ContextType = {
    hasServer: boolean;
    server?: Types.ServerType;
    claimServer: (path: string) => Promise<void>;
    localServers: Service[];
    isScanning: boolean;
    refreshData: () => void;
};

const ServerContext = createContext<ContextType | undefined>(undefined);

const ServerProvider = ({children}: {children: any}) => {
    const {isAuthenticated, token} = useAuthContext();
    const [server, setServer] = useState<Types.ServerType>();
    const hasServer = useMemo(() => server != null, [server]);
    const {localServers, isScanning, refreshData} = useLocalServers(zeroconf);

    useEffect(() => {
        async function GetServer() {
            try {
                const serverInfo = await GetMyServerInfo.Post();
                console.log('HELLO', serverInfo);
                if (serverInfo.ok) {
                    const ourServers = getOnlyOurServers(localServers);
                    console.log('ourServers', ourServers);
                    const promises = ourServers.map(s => {
                        SetPath(`http://${s.host}:${s.port}`);
                        return GetToken.Post({userToken: token as string});
                    });
                    const results = await Promise.all(promises);
                    console.log('results', results);
                    let myServer: Service = ourServers[0];
                    results.map((r, i) => {
                        if (r) {
                            myServer = ourServers[i];
                        }
                    });
                    if (myServer) {
                        setServer(serverInfo.data.server);
                        SetPath(`http://${myServer.host}:${myServer.port}`);
                    } else {
                        //TODO Add port (isn't returned by request now)
                        SetPath(`http://${serverInfo.data.server.ipPublic}:8000`);
                    }
                }
            } catch (e) {
                console.log('Error HERE', e);
            }
        }
        if (isAuthenticated) {
            GetServer();
        }
    }, [isAuthenticated, localServers]);

    async function claimServer(path: string) {
        if (!token) return;
        SetPath(path);
        try {
            const ret = await ClaimServer.Post({userToken: token});
            console.log('Claim Server ret', ret);
            if (ret.ok) {
                const serverInfo = await GetMyServerInfo.Post();
                console.log('Server Info', serverInfo);
                if (serverInfo.ok) {
                    setServer(serverInfo.data.server);
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
    return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};

function useServerContext() {
    const context = useContext(ServerContext);
    if (!context) throw Error('useServerContext can only be used inside an AuthProvider');
    return context;
}

export {ServerProvider, useServerContext};
