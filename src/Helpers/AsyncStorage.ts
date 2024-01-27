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

export const getAddressInfo = async () => {
  const ipLocal = await AsyncStorage.getItem('ipLocal');
  const ipPublic = await AsyncStorage.getItem('ipPublic');
  const port = await AsyncStorage.getItem('port');
  return { ipLocal: ipLocal, ipPublic: ipPublic, port: port };
};

export const storeAddressInfo = async ({
  ipLocal,
  ipPublic,
  port,
}: {
  ipLocal?: string | null;
  ipPublic?: string | null;
  port?: string | null;
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
};
