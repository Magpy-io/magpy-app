import React from 'react';

import { AccountIcon } from '~/Components/CommonComponents/Icons';
import SettingsPageComponent, {
  SettingsListType,
} from '~/Components/SettingsComponents/SettingsPageComponent';
import { useTheme, useThemeFunctions } from '~/Context/Contexts/ThemeContext';

const COMBO_BOX_NAME_LIGHT = 'COMBO_BOX_NAME_LIGHT';
const COMBO_BOX_NAME_DARK = 'COMBO_BOX_NAME_DARK';
const COMBO_BOX_NAME_DEVICE = 'COMBO_BOX_NAME_DEVICE';

export default function PreferencesSettingsScreen() {
  const { setUserSelectedTheme } = useThemeFunctions();
  const { userSelectedTheme } = useTheme();

  let selectedCombobox: string;

  switch (userSelectedTheme) {
    case 'light':
      selectedCombobox = COMBO_BOX_NAME_LIGHT;
      break;
    case 'dark':
      selectedCombobox = COMBO_BOX_NAME_DARK;
      break;
    case 'deviceDefault':
      selectedCombobox = COMBO_BOX_NAME_DEVICE;
      break;
  }

  const data: SettingsListType = [
    {
      title: 'Application Theme',
      data: [
        {
          type: 'RadioButton',
          title: 'Light',
          name: COMBO_BOX_NAME_LIGHT,
          checked: selectedCombobox,
          onPress: () => {
            setUserSelectedTheme('light');
          },
          icon: <AccountIcon />,
        },

        {
          type: 'RadioButton',
          title: 'Dark',
          name: COMBO_BOX_NAME_DARK,
          checked: selectedCombobox,
          onPress: () => {
            setUserSelectedTheme('dark');
          },
          icon: <AccountIcon />,
        },

        {
          type: 'RadioButton',
          title: 'Use system setting',
          name: COMBO_BOX_NAME_DEVICE,
          checked: selectedCombobox,
          onPress: () => {
            setUserSelectedTheme('deviceDefault');
          },
          icon: <AccountIcon />,
        },
      ],
    },
  ];

  return <SettingsPageComponent data={data} />;
}
