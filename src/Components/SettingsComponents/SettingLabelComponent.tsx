import React from 'react';
import { TextStyle } from 'react-native';

import SettingEntryComponent from './SettingEntryComponent';

type SettingLabelComponentProps = {
  title: string;
  onPress?: () => void;
  icon?: JSX.Element;
  style?: TextStyle;
};

export default function SettingLabelComponent({
  icon,
  title,
  onPress,
  style,
}: SettingLabelComponentProps) {
  return <SettingEntryComponent title={title} onPress={onPress} icon={icon} style={style} />;
}
