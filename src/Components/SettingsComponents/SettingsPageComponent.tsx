import React from 'react';
import { SectionList, StyleSheet, TextStyle, View } from 'react-native';

import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SettingNavigateComponent from '~/Components/SettingsComponents/SettingNavigateComponent';
import { useStyles } from '~/Hooks/useStyles';
import { TabBarPadding } from '~/Navigation/TabNavigation/TabBar';
import { colorsType } from '~/Styles/colors';
import { spacing } from '~/Styles/spacing';
import { typography } from '~/Styles/typography';

import SettingButtonComponent from './SettingButtonComponent';
import SettingRadioButtonComponent from './SettingRadioButtonComponent';
import SettingSwitchComponent from './SettingSwitchComponent';

export type ButtonType = {
  type: 'Button';
  onPress: () => void;
  title: string;
  icon?: JSX.Element;
  style?: TextStyle;
};

export type NavigationType = {
  type: 'Navigation';
  onPress: () => void;
  title: string;
  icon?: JSX.Element;
  style?: TextStyle;
};

export type SwitchType = {
  type: 'Switch';
  onPress: (switchState: boolean) => void;
  initialState: boolean;
  disabled?: boolean;
  title: string;
  icon?: JSX.Element;
  style?: TextStyle;
};

export type ComboBoxType = {
  type: 'RadioButton';
  onPress: () => void;
  name: string;
  checked: string;
  disabled?: boolean;
  title: string;
  icon?: JSX.Element;
  style?: TextStyle;
};

export type EntryTypes = ButtonType | NavigationType | SwitchType | ComboBoxType;

export type SettingsListType = Array<{ title: string; data: Array<EntryTypes> }>;

type SettingsPageComponentProps = {
  data: SettingsListType;
  header?: JSX.Element;
  footer?: JSX.Element;
};

export default function SettingsPageComponent({
  data,
  header,
  footer,
}: SettingsPageComponentProps) {
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => {
    return <Text style={styles.title}>{title}</Text>;
  };

  const renderItem = ({ item }: { item: EntryTypes }) => {
    switch (item.type) {
      case 'Button':
        return (
          <SettingButtonComponent
            icon={item.icon}
            title={item.title}
            onPress={item.onPress}
            style={item.style}
          />
        );
      case 'Navigation':
        return (
          <SettingNavigateComponent
            icon={item.icon}
            title={item.title}
            onPress={item.onPress}
            style={item.style}
          />
        );
      case 'Switch':
        return (
          <SettingSwitchComponent
            icon={item.icon}
            title={item.title}
            onPress={item.onPress}
            style={item.style}
            initialState={item.initialState}
            disabled={item.disabled}
          />
        );

      case 'RadioButton':
        return (
          <SettingRadioButtonComponent
            icon={item.icon}
            title={item.title}
            onPress={item.onPress}
            style={item.style}
            name={item.name}
            checked={item.checked}
            disabled={item.disabled}
          />
        );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <SectionList
        ListHeaderComponent={header}
        sections={data}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: spacing.spacing_l }}
        ListFooterComponent={footer}
      />
      <TabBarPadding />
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
