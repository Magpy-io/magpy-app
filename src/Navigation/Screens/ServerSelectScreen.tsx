import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import type {Service} from 'react-native-zeroconf';
import Zeroconf from 'react-native-zeroconf';
import {SetPath} from '~/Helpers/serverImportedQueries';
import {appColors} from '~/styles/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {spacing} from '~/styles/spacing';
import ServerComponent from '~/Components/SelectServerComponents.tsx/ServerComponent';
import ServersList from '~/Components/SelectServerComponents.tsx/ServersList';
import {typography} from '~/styles/typography';

const zeroconf = new Zeroconf();
export default function ServerSelectScreen() {
    const [isScanning, setIsScanning] = useState(false);
    const [services, setServices] = useState<Service[]>(new Array<Service>());

    console.log('services', services.length);
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
                console.log('Resolves service', service.name);
                setServices(oldServices => {
                    return [...oldServices, service];
                });
            }
        });

        zeroconf.on('error', err => {
            setIsScanning(false);
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
        setServices([]);

        zeroconf.scan('http', 'tcp', 'local.');

        setTimeout(() => {
            zeroconf.stop();
        }, 5000);
    };

    const onSelectServer = (service: Service) => {
        SetPath(service.host + ':' + service.port);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ServersList
                services={services}
                refreshData={refreshData}
                header={<Header isScanning={isScanning} />}
                onSelectServer={onSelectServer}
            />
        </SafeAreaView>
    );
}

function Header({isScanning}: {isScanning: boolean}) {
    const title = isScanning ? 'Searching for your local server' : 'Select your local server';
    return (
        <View style={styles.headerView}>
            {isScanning && (
                <ActivityIndicator style={styles.indicatorStyle} color={appColors.PRIMARY} />
            )}
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    indicatorStyle: {
        position: 'absolute',
        top: spacing.spacing_xxl_4,
        alignSelf: 'center',
    },
    headerView: {
        paddingBottom: spacing.spacing_xxl,
        paddingTop: spacing.spacing_xxl_5,
    },
    title: {
        paddingHorizontal: spacing.spacing_xxl,
        textAlign: 'center',
        ...typography.screenTitle,
    },
    container: {
        flex: 1,
        backgroundColor: appColors.BACKGROUND,
    },
});
