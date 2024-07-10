import React from 'react';
import { TextStyle } from 'react-native';

import SwitchComponent from '../CommonComponents/SwitchComponent';
import SettingEntryComponent from './SettingEntryComponent';

type SettingSwitchComponentProps = {
  title: string;
  initialState: boolean;
  disabled?: boolean;
  onPress: (switchState: boolean) => void;
  icon?: JSX.Element;
  style?: TextStyle;
};

export default function SettingSwitchComponent({
  icon,
  title,
  style,
  onPress,
  initialState,
  disabled,
}: SettingSwitchComponentProps) {
  return (
    <SettingEntryComponent
      title={title}
      icon={icon}
      style={style}
      notTouchable
      componentEnd={
        <SwitchComponent
          onSwitchChanged={onPress}
          initialState={initialState}
          disabled={disabled}
        />
      }
    />
  );
}
