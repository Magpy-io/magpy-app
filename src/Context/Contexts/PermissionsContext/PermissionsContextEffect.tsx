import React, { ReactNode, useEffect } from 'react';
import { AppState } from 'react-native';

import {
  hasAndroidPermissionNotifications,
  hasAndroidPermissionReadMedia,
} from '~/Helpers/GetPermissionsAndroid';

import {
  usePermissionsContextInner,
  usePermissionsContextSettersInner,
} from './PermissionsContext';

type PropsType = {
  children: ReactNode;
};

export const PermissionsContextEffect: React.FC<PropsType> = props => {
  const { mediaPermissionStatus } = usePermissionsContextInner();
  const { setMediaPermissionStatus, setNotificationsPermissionStatus } =
    usePermissionsContextSettersInner();

  // Set the permission on launch
  useEffect(() => {
    async function innerAsync() {
      const hasPermissionMedia = await hasAndroidPermissionReadMedia();
      const hasPermissionNotifications = await hasAndroidPermissionNotifications();

      setMediaPermissionStatus(hasPermissionMedia ? 'GRANTED' : 'PENDING');
      setNotificationsPermissionStatus(hasPermissionNotifications ? 'GRANTED' : 'PENDING');
    }

    innerAsync().catch(console.log);
  }, [setMediaPermissionStatus, setNotificationsPermissionStatus]);

  // Update the media permission if user leaves and comes back to the app
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
