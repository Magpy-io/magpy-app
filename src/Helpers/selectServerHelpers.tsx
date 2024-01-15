import {Service} from 'react-native-zeroconf';

const prefix = 'OpenCloudServer';

export function getServerName(serviceName: string) {
    const serverName = serviceName.split(prefix).pop();
    return serverName;
}

export function getOnlyOurServers(services: Service[]) {
    const ourServers = services.filter(s => s.name.split(prefix).length > 1);
    return ourServers;
}
