import { Permission, PermissionsAndroid, Platform } from 'react-native';

export async function hasAndroidPermissionReadMedia() {
  if (Platform.OS !== 'android') {
    throw new Error('Only use hasAndroidPermission on Android, Platform.OS == ' + Platform.OS);
  }

  if (Platform.Version > 31) {
    const imagesPermission = await hasAndroidAnyPermission(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );
    const videosPermission = await hasAndroidAnyPermission(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    );

    return imagesPermission && videosPermission;
  } else {
    const permission = await hasAndroidAnyPermission(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    return permission;
  }
}

export async function askAndroidPermissionReadMedia() {
  if (Platform.OS !== 'android') {
    throw new Error('Only use hasAndroidPermission on Android, Platform.OS == ' + Platform.OS);
  }

  if (Platform.Version > 31) {
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
  } else {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    return result == PermissionsAndroid.RESULTS.GRANTED;
  }
}

export async function hasAndroidPermissionNotifications() {
  if (Platform.OS !== 'android') {
    throw new Error('Only use hasAndroidPermission on Android, Platform.OS == ' + Platform.OS);
  }

  return await hasAndroidAnyPermission(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

export async function askAndroidPermissionNotifications() {
  if (Platform.OS !== 'android') {
    throw new Error('Only use hasAndroidPermission on Android, Platform.OS == ' + Platform.OS);
  }

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
