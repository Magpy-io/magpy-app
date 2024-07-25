import { Permission, PermissionsAndroid, Platform } from 'react-native';

async function hasAndroidPermissionReadMedia() {
  const imagesPermission = await hasAndroidAnyPermission(
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  );
  const videosPermission = await hasAndroidAnyPermission(
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  );

  return imagesPermission && videosPermission;
}

async function hasAndroidAnyPermission(permission: Permission) {
  if (Platform.OS !== 'android') {
    throw new Error('Only use hasAndroidPermission on Android, Platform.OS == ' + Platform.OS);
  }
  const hasPermission = await PermissionsAndroid.check(permission);
  return hasPermission;
}

export { hasAndroidPermissionReadMedia };
