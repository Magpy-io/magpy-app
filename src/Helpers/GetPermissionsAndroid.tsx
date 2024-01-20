import { Permission, PermissionsAndroid, Platform } from 'react-native';

async function hasAndroidPermissionWriteExternalStorage() {
  return await hasAndroidAnyPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
}

async function hasAndroidAnyPermission(permission: Permission) {
  if (Platform.OS !== 'android') {
    throw new Error('Only use hasAndroidPermission on Android, Platform.OS == ' + Platform.OS);
  }
  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

export { hasAndroidPermissionWriteExternalStorage };
