import { NavigatorScreenParams } from '@react-navigation/native';

import { TabName } from '~/Navigation/TabNavigationContext';

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
  ServerSelect: undefined;
};

export type SettingsStackParamList = {
  AccountSettings: undefined;
  ServerSettings: undefined;
};

export type TabStackParamList = {
  [TabName.Home]: undefined;
  [TabName.Server]: undefined;
  [TabName.Settings]: undefined;
};

export type ParentStackParamList = {
  Tabs: NavigatorScreenParams<TabStackParamList>;
  SettingsStackNavigator: NavigatorScreenParams<SettingsStackParamList>;
};
