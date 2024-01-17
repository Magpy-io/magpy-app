import {useEffect, useState} from 'react';
import Zeroconf, {Service} from 'react-native-zeroconf';

const zeroconf = new Zeroconf();

export default function useLocalServers() {
    const [localServers, setLocalServers] = useState<Service[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
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
            zeroconf.stop();
        }
        setLocalServers([]);
        zeroconf.scan('http', 'tcp', 'local.');
        setTimeout(() => {
            zeroconf.stop();
        }, 10000);
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
