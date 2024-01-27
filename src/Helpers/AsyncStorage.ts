import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (value: string) => {
  try {
    console.log('Saving token in AsyncStorage', value);
    await AsyncStorage.setItem('authToken', value);
  } catch (e) {
    console.log('Error saving Auth Token in AsyncStorage', e);
  }
};

export const getStoredToken = async () => {
  try {
    const value = await AsyncStorage.getItem('authToken');
    if (value !== null) {
      console.log('Getting token from AsyncStorage', value);
      return value;
    }
  } catch (e) {
    console.log('Error reading Auth Token from AsyncStorage', e);
  }
};

export const removeStoredToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    console.log('Clearing Auth token from AsyncStorage');
  } catch (e) {
    console.log('Error clearing Auth Token from AsyncStorage', e);
  }
};

export const getAddressInfo = async () => {
  try {
    const ipLocal = await AsyncStorage.getItem('ipLocal');
    const ipPublic = await AsyncStorage.getItem('ipPublic');
    const port = await AsyncStorage.getItem('port');
    return { ipLocal: ipLocal, ipPublic: ipPublic, port: port };
  } catch {
    console.log('Error Adding Address info to AsyncStorage');
  }
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
  try {
    console.log('Saving AddressInfo in AsyncStorage');
    if (ipLocal) {
      await AsyncStorage.setItem('ipLocal', ipLocal);
    }
    if (ipPublic) {
      await AsyncStorage.setItem('ipPublic', ipPublic);
    }
    if (port) {
      await AsyncStorage.setItem('port', port);
    }
  } catch (e) {
    console.log('Error saving Auth Token in AsyncStorage', e);
  }
};
