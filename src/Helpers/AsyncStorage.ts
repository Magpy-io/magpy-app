import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (value: string) => {
  await AsyncStorage.setItem('authToken', value);
};

export const getStoredToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export const removeStoredToken = async () => {
  await AsyncStorage.removeItem('authToken');
};

export const getServerInfo = async () => {
  const ipLocal = await AsyncStorage.getItem('ipLocal');
  const ipPublic = await AsyncStorage.getItem('ipPublic');
  const port = await AsyncStorage.getItem('port');
  const token = await AsyncStorage.getItem('token');
  return { ipLocal: ipLocal, ipPublic: ipPublic, port: port, token: token };
};

export const storeServerInfo = async ({
  ipLocal,
  ipPublic,
  port,
  token,
}: {
  ipLocal?: string | null;
  ipPublic?: string | null;
  port?: string | null;
  token?: string | null;
}) => {
  if (ipLocal != null) {
    await AsyncStorage.setItem('ipLocal', ipLocal);
  }
  if (ipPublic != null) {
    await AsyncStorage.setItem('ipPublic', ipPublic);
  }
  if (port != null) {
    await AsyncStorage.setItem('port', port);
  }
  if (token != null) {
    await AsyncStorage.setItem('token', token);
  }
};

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
