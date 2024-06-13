import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLocalAccountServerInfo = async () => {
  const serverIp = await AsyncStorage.getItem('serverIp');
  const serverPort = await AsyncStorage.getItem('serverPort');
  const serverToken = await AsyncStorage.getItem('serverToken');
  return { serverIp, serverPort, serverToken };
};

export const storeLocalAccountServerInfo = async ({
  serverIp,
  serverPort,
  serverToken,
}: {
  serverIp: string | null;
  serverPort: string | null;
  serverToken: string | null;
}) => {
  if (serverIp != null) {
    await AsyncStorage.setItem('serverIp', serverIp);
  }
  if (serverPort != null) {
    await AsyncStorage.setItem('serverPort', serverPort);
  }
  if (serverToken != null) {
    await AsyncStorage.setItem('serverToken', serverToken);
  }
};
