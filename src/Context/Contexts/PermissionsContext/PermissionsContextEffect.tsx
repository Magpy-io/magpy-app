import React, { ReactNode, useEffect } from 'react';
import { AppState } from 'react-native';

import { hasAndroidPermissionReadMedia } from '~/Helpers/GetPermissionsAndroid';

import { usePermissionsContextInner } from './PermissionsContext';

type PropsType = {
  children: ReactNode;
};

export const PermissionsContextEffect: React.FC<PropsType> = props => {
  const { setMediaPermissionStatus, mediaPermissionStatus } = usePermissionsContextInner();

  // Set the permission on launch
  useEffect(() => {
    hasAndroidPermissionReadMedia()
      .then(hasPermission => setMediaPermissionStatus(hasPermission ? 'GRANTED' : 'PENDING'))
      .catch(console.log);
  }, [setMediaPermissionStatus]);

  // Update the permission after launch if user leaves and comes back to the app
  useEffect(() => {
    const subscription = AppState.addEventListener('focus', () => {
      if (mediaPermissionStatus == 'PENDING') {
        return;
      }

      hasAndroidPermissionReadMedia()
        .then(hasPermission => {
          setMediaPermissionStatus(hasPermission ? 'GRANTED' : 'REJECTED');
        })
        .catch(console.log);
    });

    return () => {
      subscription.remove();
    };
  }, [mediaPermissionStatus, setMediaPermissionStatus]);

  return props.children;
};
