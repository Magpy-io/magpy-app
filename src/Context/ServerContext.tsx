import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {GetUserToken, ServerType, getMyServerInfoPost} from '~/Helpers/backendImportedQueries';
import {useAuthContext} from './AuthContext';
import {ClaimServerPost, GetTokenPost, SetPath} from '~/Helpers/serverImportedQueries';
import Zeroconf, {Service} from 'react-native-zeroconf';
import {getOnlyOurServers} from '~/Helpers/selectServerHelpers';

type ContextType = {
    hasServer: boolean;
    server?: ServerType;
    claimServer: (path: string) => Promise<void>;
    localServers: Service[];
    isScanning: boolean;
    refreshData: () => void;
};

const ServerContext = createContext<ContextType | undefined>(undefined);

const zeroconf = new Zeroconf();
const ServerProvider = ({children}: {children: any}) => {
    const {isAuthenticated, token} = useAuthContext();
    const [server, setServer] = useState<ServerType>();
    const hasServer = useMemo(() => server != null, [server]);
    const [localServers, setLocalServers] = useState<Service[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        refreshData();
        zeroconf.on('start', () => {
            setIsScanning(true);
        });
        zeroconf.on('stop', () => {
            setIsScanning(false);
        });
        zeroconf.on('resolved', service => {
            if (true) {
                console.log('resolved', service.name);
                setLocalServers(oldServices => {
                    return [...oldServices, service];
                });
            }
        });
        zeroconf.on('error', err => {
            console.log('[Error]', err);
        });
        return () => {
            zeroconf.removeDeviceListeners();
        };
    }, []);

    const refreshData = () => {
        if (isScanning) {
            return;
        }
        setLocalServers([]);
        zeroconf.scan('http', 'tcp', 'local.');
        setTimeout(() => {
            zeroconf.stop();
        }, 5000);
    };

    useEffect(() => {
        async function GetServer() {
            try {
                const serverInfo = await getMyServerInfoPost();
                console.log('HELLO', serverInfo);
                if (serverInfo.ok) {
                    const ourServers = getOnlyOurServers(localServers);
                    console.log('ourServers', ourServers);
                    const promises = ourServers.map(s => {
                        SetPath(`http://${s.host}:${s.port}`);
                        return GetTokenPost({userToken: token as string});
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
                        SetPath(`http://${myServer.host}:${myServer.port}`);
                        setServer(serverInfo.data.server);
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
