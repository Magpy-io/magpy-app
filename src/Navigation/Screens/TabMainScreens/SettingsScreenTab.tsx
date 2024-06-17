import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AccountIcon,
  CloseIcon,
  HelpIcon,
  InfoIcon,
  NotificationIcon,
  PhoneIcon,
  PreferencesIcon,
  UploadIcon,
} from '~/Components/CommonComponents/Icons';
import AutoBackupCard from '~/Components/SettingsComponents/AutoBackupCard';
import LogoutComponent from '~/Components/SettingsComponents/LogoutComponent';
import ProfileHeader from '~/Components/SettingsComponents/ProfileHeader';
import SettingComponent from '~/Components/SettingsComponents/SettingComponent';
import { uniqueDeviceId } from '~/Config/config';
import { TokenManager } from '~/Helpers/ServerQueries';
import { GetPath } from '~/Helpers/ServerQueries/PathManager';
import { useStyles } from '~/Hooks/useStyles';
import { AutoBackupModule } from '~/NativeModules/AutoBackupModule';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

type ItemType = {
  title: string;
  onPress: () => void;
  icon: JSX.Element;
};

export default function SettingsScreenTab() {
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);

  const path = GetPath();
  const token = TokenManager.GetUserToken();

  const [backupOn, setBackupOn] = useState(false);
  console.log('backupOn', backupOn);

  useEffect(() => {
    AutoBackupModule.IsWorkerAlive()
      .then(s => setBackupOn(s))
      .catch(console.log);
  }, []);

  const data = [
    {
      title: 'Storage settings',
      data: [
        {
          title: 'Activate auto-backup',
          onPress: async () => {
            await AutoBackupModule.StartBackupWorker({
              url: path,
              deviceId: uniqueDeviceId,
              serverToken: token,
            });
            console.log('worker started');

            const s = await AutoBackupModule.IsWorkerAlive();
            setBackupOn(s);
          },
          icon: <UploadIcon />,
        },
        {
          title: 'Disable auto-backup',
          onPress: async () => {
            console.log('stop button');
            await AutoBackupModule.StopWorker();
            console.log('worker stopped');

            const s = await AutoBackupModule.IsWorkerAlive();
            setBackupOn(s);
          },
          icon: <CloseIcon />,
        },
        {
          title: 'Free up space from this device',
          onPress: () => {},
          icon: <PhoneIcon />,
        },
      ],
    },
    {
      title: 'App settings',
      data: [
        {
          title: 'Account settings',
          onPress: () => {},
          icon: <AccountIcon />,
        },
        {
          title: 'Preferences',
          onPress: () => {},
          icon: <PreferencesIcon />,
        },
        {
          title: 'Notifications',
          onPress: () => {},
          icon: <NotificationIcon />,
        },
      ],
    },
    {
      title: 'Info',
      data: [
        {
          title: 'Help & Support',
          onPress: () => {},
          icon: <HelpIcon />,
        },
        {
          title: 'About Magpy',
          onPress: () => {},
          icon: <InfoIcon />,
        },
      ],
    },
  ];

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => {
    return <Text style={styles.title}>{title}</Text>;
  };

  const renderItem = ({ item }: { item: ItemType }) => {
    return <SettingComponent icon={item.icon} title={item.title} onPress={item.onPress} />;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <SectionList
        ListHeaderComponent={<Header backupOn={backupOn} />}
        sections={data}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: spacing.spacing_l }}
        ListFooterComponent={<LogoutComponent />}
      />
      <TabBarPadding />
    </View>
  );
}

function Header(props: { backupOn: boolean }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.header}>
      <ProfileHeader />
      <AutoBackupCard />
      {props.backupOn ? <Text>Backup On</Text> : <Text>Backup Off</Text>}
    </View>
  );
}

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    header: {
      paddingTop: spacing.spacing_xl,
      gap: spacing.spacing_xl,
    },
    logoutText: {
      ...typography(colors).mediumTextBold,
      color: colors.ERROR,
    },
    title: {
      ...typography(colors).sectionTitle,
      paddingVertical: spacing.spacing_l,
    },
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
  });
