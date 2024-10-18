import React, { useState } from 'react';
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
  const [state, setState] = useState(initialState);

  const onSwitchClicked = () => {
    setState(!state);
    onPress(!state);
  };

  return (
    <SettingEntryComponent
      title={title}
      icon={icon}
      style={style}
      onPress={onSwitchClicked}
      componentEnd={
        <SwitchComponent onSwitchChanged={onSwitchClicked} state={state} disabled={disabled} />
      }
    />
  );
}
