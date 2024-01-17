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
import {appColors} from '~/styles/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {spacing} from '~/styles/spacing';
import ServersList from '~/Components/SelectServerComponents.tsx/ServersList';
import {typography} from '~/styles/typography';
import {useServerContext} from '~/Context/ServerContext';

export default function ServerSelectScreen() {
    const {claimServer, localServers, isScanning, refreshData} = useServerContext();

    const onSelectServer = async (service: Service) => {
        await claimServer('http://' + service.host + ':' + service.port);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ServersList
                services={localServers}
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
