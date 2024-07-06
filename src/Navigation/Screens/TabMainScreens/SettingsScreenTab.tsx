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
import { useStyles } from '~/Hooks/useStyles';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';
import { spacing } from '~/Styles/spacing';

export default function SettingsScreenTab() {
  const { navigate } = useMainStackNavigation();

  const data: SettingsListType = [
    {
      title: 'Settings',
      data: [
        {
          type: 'Navigation',
          title: 'Backup Settings',
          onPress: () => {},
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
          onPress: () => {},
          icon: <PreferencesIcon />,
        },
        {
          type: 'Navigation',
          title: 'About Magpy',
          onPress: () => {},
          icon: <InfoIcon />,
        },
        {
          type: 'Button',
          title: 'Logout',
          onPress: () => {},
          icon: <LogoutIcon />,
        },
      ],
    },
  ];

  return <SettingsPageComponent data={data} header={<Header />} />;
}

function Header() {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.header}>
      <ProfileHeader />
      <AutoBackupCard />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    header: {
      paddingTop: spacing.spacing_xl,
      gap: spacing.spacing_xl,
    },
  });
