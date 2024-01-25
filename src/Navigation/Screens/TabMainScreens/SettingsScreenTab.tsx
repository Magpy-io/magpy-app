import React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AccountIcon,
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
import { useMainNavigation } from '~/Navigation/Navigation';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { appColors, colors } from '~/styles/colors';
import { spacing } from '~/styles/spacing';
import { typography } from '~/styles/typography';

type ItemType = {
  title: string;
  onPress: () => void;
  icon: JSX.Element;
};

export default function SettingsScreenTab() {
  const insets = useSafeAreaInsets();
  const navigation = useMainNavigation();

  const data = [
    {
      title: 'Storage settings',
      data: [
        {
          title: 'Back up settings',
          onPress: () => {},
          icon: <UploadIcon />,
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
          onPress: () => {
            navigation.navigate('SettingsStackNavigator', { screen: 'AccountSettings' });
          },
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
          title: 'About Propio',
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SectionList
        ListHeaderComponent={Header}
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

function Header() {
  return (
    <View style={styles.header}>
      <ProfileHeader />
      <AutoBackupCard />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.spacing_xl,
    gap: spacing.spacing_xl,
  },
  logoutText: {
    ...typography.mediumTextBold,
    color: colors.COLOR_ERROR_500,
  },
  title: {
    ...typography.sectionTitle,
    paddingVertical: spacing.spacing_l,
  },
  container: {
    flex: 1,
    backgroundColor: appColors.BACKGROUND,
  },
});
