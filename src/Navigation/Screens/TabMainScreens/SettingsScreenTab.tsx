import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AccountIcon,
  InfoIcon,
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
          title: 'Backup Settings',
          onPress: () => {},
          icon: <UploadIcon />,
        },
        {
          title: 'Account settings',
          onPress: () => {
            navigate('AccountSettings');
          },
          icon: <AccountIcon />,
        },
        {
          title: 'Preferences',
          onPress: () => {},
          icon: <PreferencesIcon />,
        },
        {
          title: 'About Magpy',
          onPress: () => {},
          icon: <InfoIcon />,
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
