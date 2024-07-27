import React from 'react';
import { TextStyle } from 'react-native';

import RadioButtonComponent from '../CommonComponents/RadioButtonComponent';
import SettingEntryComponent from './SettingEntryComponent';

type SettingRadioButtonComponentProps = {
  title: string;
  name: string;
  checked: string;
  disabled?: boolean;
  onPress: () => void;
  icon?: JSX.Element;
  style?: TextStyle;
};

export default function SettingRadioButtonComponent({
  icon,
  title,
  style,
  onPress,
  name,
  checked,
  disabled,
}: SettingRadioButtonComponentProps) {
  return (
    <SettingEntryComponent
      title={title}
      icon={icon}
      style={style}
      notTouchable
      componentEnd={
        <RadioButtonComponent
          onPress={onPress}
          name={name}
          checked={checked}
          disabled={disabled}
        />
      }
    />
  );
}
