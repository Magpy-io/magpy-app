import React from 'react';
import { TextStyle } from 'react-native';

import SettingEntryComponent from './SettingEntryComponent';

type SettingButtonComponentProps = {
  title: string;
  onPress: () => void;
  icon: JSX.Element;
  style?: TextStyle;
};

export default function SettingButtonComponent({
  icon,
  title,
  onPress,
  style,
}: SettingButtonComponentProps) {
  return <SettingEntryComponent title={title} onPress={onPress} icon={icon} style={style} />;
}
