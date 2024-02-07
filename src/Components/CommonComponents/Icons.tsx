import React from 'react';

import { Icon, IconProps } from 'react-native-elements';

import { appColors } from '~/styles/colors';

export function ArrowIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon name="arrow-forward" type="ionicon" color={appColors.TEXT} size={16} {...props} />
  );
}

export function ChevronIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon
      name="chevron-forward-outline"
      type="ionicon"
      color={appColors.TEXT_LIGHT}
      size={16}
      {...props}
    />
  );
}

export function BackIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon name="chevron-back" type="ionicon" color={appColors.TEXT} size={22} {...props} />
  );
}

export function UploadIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon
      name="cloud-upload-outline"
      type="ionicon"
      color={appColors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function PhoneIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon
      name="phone-portrait-outline"
      type="ionicon"
      color={appColors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function TuneIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon name="options-outline" type="ionicon" color={appColors.TEXT} size={22} {...props} />
  );
}

export function AccountIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon
      name="person-circle-outline"
      type="ionicon"
      color={appColors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function InfoIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon
      name="information-circle-outline"
      type="ionicon"
      color={appColors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function HelpIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon
      name="help-circle-outline"
      type="ionicon"
      color={appColors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function NotificationIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon
      name="notifications-outline"
      type="ionicon"
      color={appColors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function PreferencesIcon({ ...props }: Omit<IconProps, 'name'>) {
  return (
    <Icon name="options-outline" type="ionicon" color={appColors.TEXT} size={22} {...props} />
  );
}
