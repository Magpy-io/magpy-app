import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import type {Service} from 'react-native-zeroconf';
import ServerComponent from '~/Components/SelectServerComponents.tsx/ServerComponent';
import {appColors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';

type ServersListProps = {
    services: Service[];
    refreshData: () => void;
    header: React.JSX.Element;
    onSelectServer: (service: Service) => void;
};

export default function ServersList({
    services,
    refreshData,
    header,
    onSelectServer,
}: ServersListProps) {
    const renderRow = ({item, index}: {item: Service; index: number}) => {
        return <ServerComponent service={services[index]} onSelectServer={onSelectServer} />;
    };

    return (
        <FlatList
            data={services}
            renderItem={renderRow}
            keyExtractor={(key, index) => key.fullName + index.toString()}
            onRefresh={refreshData}
            refreshing={false}
            ListHeaderComponent={header}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
}
const styles = StyleSheet.create({
    separator: {
        height: spacing.spacing_l,
    },
});
