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

export const storeIsUsingLocalAccount = async function (isUsingLocalAccount: boolean) {
  await AsyncStorage.setItem('isUsingLocalAccount', JSON.stringify(isUsingLocalAccount));
};

export const getIsUsingLocalAccount = async function () {
  const isUsingLocalAccountString = await AsyncStorage.getItem('isUsingLocalAccount');

  if (isUsingLocalAccountString == null) {
    return null;
  }

  return JSON.parse(isUsingLocalAccountString) as boolean;
};
