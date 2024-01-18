import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {Types, GetMyServerInfo} from '~/Helpers/BackendQueries';
import {useAuthContext} from './AuthContext';
import {ClaimServer, GetToken, SetPath} from '~/Helpers/ServerQueries';

import useLocalServers from '~/Hooks/useLocalServers';

type ContextType = {
    isServerReachable: boolean;
    ipLocal: string;
    ipPublic: string;
    port: string;
};

const ServerContext = createContext<ContextType | undefined>(undefined);

const ServerProvider = ({children}: {children: any}) => {
    const {token} = useAuthContext();
    const [isServerReachable, setIsServerReachable] = useState(false);
    const [ipLocal, setIpLocal] = useState<string | null>(null);
    const [ipPublic, setIpPublic] = useState<string | null>(null);
    const [port, setPort] = useState<string | null>(null);

    useEffect(() => {
        async function core() {
            try {
                const ipLocal = await AsyncStorage.getItem('ipLocal');
                const ipPublic = await AsyncStorage.getItem('ipPublic');
                const port = await AsyncStorage.getItem('port');

                setIpLocal(ipLocal);
                setIpPublic(ipPublic);
                setPort(port);
            } catch (err) {}
        }
        core();
    }, []);

    useEffect(() => {
        async function FindServerAddress() {
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
        if (!isServerReachable) {
            FindServerAddress();
        }
    }, [isServerReachable]);

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
