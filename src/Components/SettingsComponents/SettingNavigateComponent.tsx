import React from 'react';
import { TextStyle } from 'react-native';

import { ChevronIcon } from '../CommonComponents/Icons';
import SettingEntryComponent from './SettingEntryComponent';

type SettingNavigateComponentProps = {
  title: string;
  onPress: () => void;
  icon?: JSX.Element;
  style?: TextStyle;
};

export default function SettingNavigateComponent({
  icon,
  title,
  onPress,
  style,
}: SettingNavigateComponentProps) {
  return (
    <SettingEntryComponent
      title={title}
      onPress={onPress}
      icon={icon}
      style={style}
      componentEnd={<ChevronIcon />}
    />
  );
}
