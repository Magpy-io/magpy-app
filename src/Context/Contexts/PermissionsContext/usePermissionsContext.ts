import { useCallback } from 'react';
import { PermissionsAndroid } from 'react-native';

import { usePermissionsContextInner } from './PermissionsContext';

export function usePermissionsContextFunctions() {}

export function usePermissionsContext() {
  const { mediaPermissionStatus, setMediaPermissionStatus } = usePermissionsContextInner();

  const askMediaPermission = useCallback(async () => {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);

    const permissionsGranted =
      result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ==
        PermissionsAndroid.RESULTS.GRANTED &&
      result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ==
        PermissionsAndroid.RESULTS.GRANTED;

    setMediaPermissionStatus(permissionsGranted ? 'GRANTED' : 'REJECTED');
  }, [setMediaPermissionStatus]);

  return { mediaPermissionStatus, askMediaPermission };
}
