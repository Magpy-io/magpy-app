import {useEffect, useState} from 'react';
import Zeroconf, {Service} from 'react-native-zeroconf';

export default function useLocalServers(zeroconf: Zeroconf) {
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
    return {
        localServers,
        isScanning,
        refreshData,
    };
}
