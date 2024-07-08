import React from 'react';
import { TextStyle } from 'react-native';

import SettingEntryComponent from './SettingEntryComponent';

type SettingLabelComponentProps = {
  title: string;
  icon?: JSX.Element;
  style?: TextStyle;
};

export default function SettingLabelComponent({
  icon,
  title,
  style,
}: SettingLabelComponentProps) {
  return <SettingEntryComponent title={title} icon={icon} style={style} notTouchable />;
}
