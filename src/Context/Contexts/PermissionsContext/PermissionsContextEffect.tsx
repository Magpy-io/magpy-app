import React, { ReactNode, useEffect } from 'react';
import { AppState } from 'react-native';

import { hasAndroidPermissionReadMedia } from '~/Helpers/GetPermissionsAndroid';

import { usePermissionsContextInner } from './PermissionsContext';

type PropsType = {
  children: ReactNode;
};

export const PermissionsContextEffect: React.FC<PropsType> = props => {
  const { setHasMediaPermission } = usePermissionsContextInner();

  useEffect(() => {
    hasAndroidPermissionReadMedia()
      .then(hasPermission => setHasMediaPermission(hasPermission))
      .catch(console.log);

    const subscription = AppState.addEventListener('focus', () => {
      hasAndroidPermissionReadMedia()
        .then(hasPermission => setHasMediaPermission(hasPermission))
        .catch(console.log);
    });

    return () => {
      subscription.remove();
    };
  }, [setHasMediaPermission]);

  return props.children;
};
