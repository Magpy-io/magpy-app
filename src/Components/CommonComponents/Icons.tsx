import React from 'react';

import { Icon, IconProps } from 'react-native-elements';

import { useTheme } from '~/Context/ThemeContext';

export type CustomIconProps = Omit<IconProps, 'name'>;

// ---------------------- Actions (upload, download..Etc)

export function UploadIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon
      name="cloud-upload-outline"
      type="ionicon"
      color={colors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function DeleteIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return <Icon name="trash-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />;
}

export function DeleteFromDeviceIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon name="phonelink-erase" type="material" color={colors.TEXT} size={22} {...props} />
  );
}

export function DeleteFromServerIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon
      name="cloud-offline-outline"
      type="ionicon"
      color={colors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function DownloadIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon name="download-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />
  );
}

export function ShareIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon
      name="share-social-outline"
      type="ionicon"
      color={colors.TEXT}
      size={22}
      {...props}
    />
  );
}

// ---------------------- Photo information icons (in device, in server, date...Etc)

export function InDeviceIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon name="mobile-friendly" type="material" color={colors.TEXT} size={22} {...props} />
  );
}

export function NotInDeviceIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon name="phonelink-erase" type="material" color={colors.TEXT} size={22} {...props} />
  );
}

export function InServerIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon name="cloud-done-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />
  );
}

export function NotInServerIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon
      name="cloud-offline-outline"
      type="ionicon"
      color={colors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function ImageIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return <Icon name="image-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />;
}

export function TimeIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return <Icon name="time-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />;
}

// ---------------------- General icons (menu, filter, sort..etc)

export function TuneIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon name="options-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />
  );
}

export function FilterIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return <Icon name="filter" type="antdesign" color={colors.TEXT} size={22} {...props} />;
}

export function GroupIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return <Icon name="grid-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />;
}

export function SortIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return <Icon name="swap-vertical" type="ionicon" color={colors.TEXT} size={22} {...props} />;
}

export function ArrowIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();
  return <Icon name="arrow-forward" type="ionicon" color={colors.TEXT} size={16} {...props} />;
}

export function ChevronIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon
      name="chevron-forward-outline"
      type="ionicon"
      color={colors.TEXT_LIGHT}
      size={16}
      {...props}
    />
  );
}

export function BackIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return <Icon name="chevron-back" type="ionicon" color={colors.TEXT} size={22} {...props} />;
}

export function MoreIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return <Icon name="more-vertical" type="feather" color={colors.TEXT} size={22} {...props} />;
}

export function CloseIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return <Icon name="close-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />;
}

// ---------------------- SETTINGS icons

export function AccountIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon
      name="person-circle-outline"
      type="ionicon"
      color={colors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function InfoIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon
      name="information-circle-outline"
      type="ionicon"
      color={colors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function HelpIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon name="help-circle-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />
  );
}

export function NotificationIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon
      name="notifications-outline"
      type="ionicon"
      color={colors.TEXT}
      size={22}
      {...props}
    />
  );
}

export function PreferencesIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon name="options-outline" type="ionicon" color={colors.TEXT} size={22} {...props} />
  );
}

export function PhoneIcon({ ...props }: CustomIconProps) {
  const { colors } = useTheme();

  return (
    <Icon
      name="phone-portrait-outline"
      type="ionicon"
      color={colors.TEXT}
      size={22}
      {...props}
    />
  );
}
