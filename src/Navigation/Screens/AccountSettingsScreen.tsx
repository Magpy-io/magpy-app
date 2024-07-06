import React from 'react';

import { AccountIcon } from '~/Components/CommonComponents/Icons';
import SettingsPageComponent, {
  SettingsListType,
} from '~/Components/SettingsComponents/SettingsPageComponent';
import { useAuthContextFunctions } from '~/Context/Contexts/AuthContext';
import { useMainContext, useMainContextFunctions } from '~/Context/Contexts/MainContext';
import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';

import { useMainStackNavigation } from '../Navigators/MainStackNavigator';

export default function SettingsScreenTab() {
  const navigation = useMainStackNavigation();
  const { logout } = useAuthContextFunctions();
  const { isUsingLocalAccount } = useMainContext();
  const { setIsUsingLocalAccount } = useMainContextFunctions();

  const { forgetServer } = useServerContextFunctions();

  const data: SettingsListType = [
    {
      title: 'Account Settings',
      data: [
        {
          type: 'Switch',
          title: 'Using online account',
          onPress: isOnlineAccount => {
            forgetServer();
            setIsUsingLocalAccount(s => !s);
            logout();
            if (isOnlineAccount) {
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
          },
          icon: <AccountIcon />,
          initialState: !isUsingLocalAccount,
        },
      ],
    },
  ];

  return <SettingsPageComponent data={data} />;
}
