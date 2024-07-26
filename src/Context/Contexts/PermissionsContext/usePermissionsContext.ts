import { useCallback } from 'react';

import {
  askAndroidPermissionNotifications,
  askAndroidPermissionReadMedia,
} from '~/Helpers/GetPermissionsAndroid';

import {
  usePermissionsContextInner,
  usePermissionsContextSettersInner,
} from './PermissionsContext';

export function usePermissionsContextFunctions() {}

export function usePermissionsContext() {
  const { mediaPermissionStatus, notificationsPermissionStatus } =
    usePermissionsContextInner();
  const { setMediaPermissionStatus, setNotificationsPermissionStatus } =
    usePermissionsContextSettersInner();

  const askMediaPermission = useCallback(async () => {
    const permissionsGranted = await askAndroidPermissionReadMedia();

    const permissionStatus = permissionsGranted ? 'GRANTED' : 'REJECTED';

    setMediaPermissionStatus(permissionStatus);
    return permissionStatus;
  }, [setMediaPermissionStatus]);

  const askNotificationsPermission = useCallback(async () => {
    const permissionsGranted = await askAndroidPermissionNotifications();

    const permissionStatus = permissionsGranted ? 'GRANTED' : 'REJECTED';

    setNotificationsPermissionStatus(permissionStatus);
    return permissionStatus;
  }, [setNotificationsPermissionStatus]);

  return {
    mediaPermissionStatus,
    askMediaPermission,
    notificationsPermissionStatus,
    askNotificationsPermission,
  };
}
