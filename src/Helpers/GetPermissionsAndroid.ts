import { Permission, PermissionsAndroid, Platform } from 'react-native';

export async function hasAndroidPermissionReadMedia() {
  const imagesPermission = await hasAndroidAnyPermission(
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  );
  const videosPermission = await hasAndroidAnyPermission(
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  );

  return imagesPermission && videosPermission;
}

export async function askAndroidPermissionReadMedia() {
  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  ]);

  const permissionsGranted =
    result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ==
      PermissionsAndroid.RESULTS.GRANTED &&
    result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ==
      PermissionsAndroid.RESULTS.GRANTED;

  return permissionsGranted;
}

export async function hasAndroidPermissionNotifications() {
  return await hasAndroidAnyPermission(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

export async function askAndroidPermissionNotifications() {
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  return result == PermissionsAndroid.RESULTS.GRANTED;
}

async function hasAndroidAnyPermission(permission: Permission) {
  if (Platform.OS !== 'android') {
    throw new Error('Only use hasAndroidPermission on Android, Platform.OS == ' + Platform.OS);
  }
  const hasPermission = await PermissionsAndroid.check(permission);
  return hasPermission;
}
