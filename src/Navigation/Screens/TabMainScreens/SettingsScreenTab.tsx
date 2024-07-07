import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AccountIcon,
  InfoIcon,
  LogoutIcon,
  PreferencesIcon,
  UploadIcon,
} from '~/Components/CommonComponents/Icons';
import AutoBackupCard from '~/Components/SettingsComponents/AutoBackupCard';
import ProfileHeader from '~/Components/SettingsComponents/ProfileHeader';
import SettingsPageComponent, {
  SettingsListType,
} from '~/Components/SettingsComponents/SettingsPageComponent';
import { useAuthContextFunctions } from '~/Context/Contexts/AuthContext';
import { useBackupWorkerContext } from '~/Context/Contexts/BackupWorkerContext';
import { useMainContext } from '~/Context/Contexts/MainContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useStyles } from '~/Hooks/useStyles';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';

export default function SettingsScreenTab() {
  const { navigate, reset } = useMainStackNavigation();

  const { isUsingLocalAccount } = useMainContext();
  const { autobackupEnabled } = useBackupWorkerContext();
  const { isServerReachable } = useServerContext();

  const { logout } = useAuthContextFunctions();

  const onPressLogout = () => {
    logout();
    reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const data: SettingsListType = [
    {
      title: 'Settings',
      data: [
        {
          type: 'Navigation',
          title: 'Backup Settings',
          onPress: () => {
            navigate('BackupSettings');
          },
          icon: <UploadIcon />,
        },
        {
          type: 'Navigation',
          title: 'Account settings',
          onPress: () => {
            navigate('AccountSettings');
          },
          icon: <AccountIcon />,
        },
        {
          type: 'Navigation',
          title: 'Preferences',
          onPress: () => {
            navigate('PreferencesSettings');
          },
          icon: <PreferencesIcon />,
        },
        {
          type: 'Navigation',
          title: 'About Magpy',
          onPress: () => {},
          icon: <InfoIcon />,
        },
      ],
    },
  ];

  if (!isUsingLocalAccount) {
    data[0].data.push({
      type: 'Button',
      title: 'Logout',
      onPress: onPressLogout,
      icon: <LogoutIcon />,
    });
  }

  return (
    <SettingsPageComponent
      data={data}
      header={<Header displayCard={!autobackupEnabled && isServerReachable} />}
    />
  );
}

function Header(props: { displayCard?: boolean }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.header}>
      <ProfileHeader />
      {props.displayCard && <AutoBackupCard />}
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    header: {
      paddingTop: spacing.spacing_xl,
      gap: spacing.spacing_xl,
    },
    logoutButton: {
      color: colors.ERROR,
    },
  });
