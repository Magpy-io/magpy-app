import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import type {Service} from 'react-native-zeroconf';
import {appColors} from '~/styles/colors';
import {spacing} from '~/styles/spacing';
import {textSize} from '~/styles/typography';
import {ArrowIcon} from '../CommonComponents/Icons';

function getServerName(serviceName: string) {
    const prefix = 'OpenCloudServer';
    const serverName = serviceName.split(prefix).pop();
    return serverName;
}

type ServerComponentProps = {
    onSelectServer: (service: Service) => void;
    service: Service;
};

export default function ServerComponent({onSelectServer, service}: ServerComponentProps) {
    const ServerName = getServerName(service.name);
    const IpAddress = `${service.host}: ${service.port}`;
    return (
        <TouchableOpacity onPress={() => onSelectServer(service)} style={styles.viewStyle}>
            <View>
                <Text style={styles.name}>{ServerName}</Text>
                <Text style={styles.ipAddress}>{IpAddress}</Text>
            </View>
            <ArrowIcon />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    ipAddress: {
        ...textSize.medium,
        color: appColors.TEXT_LIGHT,
    },
    name: {
        ...textSize.large,
        color: appColors.TEXT,
    },
    viewStyle: {
        marginHorizontal: spacing.spacing_l,
        borderRadius: spacing.spacing_xs,
        backgroundColor: appColors.BACKGROUND_LIGHT,
        padding: spacing.spacing_m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
