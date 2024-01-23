import { StackNavigationProp } from '@react-navigation/stack';

import { TabName } from '~/Context/TabNavigationContext';

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
  Tabs: StackNavigationProp<TabStackParamList>;
  SettingsStackNavigator: StackNavigationProp<SettingsStackParamList>;
};
