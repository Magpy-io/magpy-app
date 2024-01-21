import React from 'react';

import { Icon, IconProps } from 'react-native-elements';

import { appColors } from '~/styles/colors';

export function ArrowIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon name="arrow-forward" type="ionicon" color={appColors.TEXT} size={16} {...props} />
  );
}
