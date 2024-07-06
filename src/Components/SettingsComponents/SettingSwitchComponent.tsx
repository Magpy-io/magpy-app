import React from 'react';
import { TextStyle } from 'react-native';

import SettingEntryComponent from './SettingEntryComponent';
import SwitchComponent from './SwitchComponent';

type SettingSwitchComponentProps = {
  title: string;
  onPress: (switchState: boolean) => void;
  icon: JSX.Element;
  style?: TextStyle;
};

export default function SettingSwitchComponent({
  icon,
  title,
  style,
  onPress,
}: SettingSwitchComponentProps) {
  return (
    <SettingEntryComponent
      title={title}
      icon={icon}
      style={style}
      componentEnd={<SwitchComponent onSwitchChanged={onPress} />}
    />
  );
}
