import {useEffect, useState} from 'react';
import Zeroconf from 'react-native-zeroconf';
import {serverMdnsPrefix} from '~/Config/config';

const zeroconf = new Zeroconf();

export type Server = {name: string; ip: string; port: string};

export default function useLocalServers() {
    const [localServers, setLocalServers] = useState<Server[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        zeroconf.on('start', () => {
            setIsScanning(true);
        });
        zeroconf.on('stop', () => {
            setIsScanning(false);
        });
        zeroconf.on('resolved', service => {
            console.log('resolved', service);
            if (service.name.startsWith(serverMdnsPrefix)) {
                setLocalServers(oldServers => {
                    return [
                        ...oldServers,
                        {
                            name: service.name.replace(serverMdnsPrefix, ''),
                            ip: service.host,
                            port: service.port.toString(),
                        },
                    ];
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
            zeroconf.stop();
        }
        setLocalServers([]);
        zeroconf.scan('http', 'tcp', 'local.');
        setTimeout(() => {
            zeroconf.stop();
        }, 5000);
    };

    const stopSearch = () => {
        zeroconf.stop();
    };

    return {
        localServers,
        isScanning,
        refreshData,
        stopSearch,
    };
}
