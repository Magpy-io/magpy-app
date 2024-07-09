import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Badge, Icon, Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useServerStatusColor } from '~/Components/ServerComponents/hooks/useServerStatusColor';
import { useTheme } from '~/Context/Contexts/ThemeContext';
import { useStyles } from '~/Hooks/useStyles';
import {
  TabName,
  useTabNavigationContext,
} from '~/Navigation/TabNavigation/TabNavigationContext';
import { colorsType } from '~/Styles/colors';
import { typography } from '~/Styles/typography';

type IconType = { name: string; type: string };
type RouteType = {
  name: TabName;
  icon: IconType;
  iconFocused: IconType;
};

const routes: RouteType[] = [
  {
    name: TabName.Server,
    icon: {
      name: 'server-outline',
      type: 'ionicon',
    },
    iconFocused: {
      name: 'server-sharp',
      type: 'ionicon',
    },
  },
  {
    name: TabName.Home,
    icon: {
      name: 'home-outline',
      type: 'ionicon',
    },
    iconFocused: {
      name: 'home-sharp',
      type: 'ionicon',
    },
  },
  {
    name: TabName.Settings,
    icon: {
      name: 'settings-outline',
      type: 'ionicon',
    },
    iconFocused: {
      name: 'settings-sharp',
      type: 'ionicon',
    },
  },
];

export default function TabBar() {
  const { hidden } = useTabNavigationContext();
  const insets = useSafeAreaInsets();
  const styles = useStyles(makeStyles);
  if (hidden) {
    return <View />;
  }
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.tabView]}>
        {routes.map(route => {
          return (
            <TabElement
              key={route.name}
              routeName={route.name}
              icon={route.icon}
              iconFocused={route.iconFocused}
            />
          );
        })}
      </View>
    </View>
  );
}

type TabElementProps = {
  routeName: TabName;
  icon: IconType;
  iconFocused: IconType;
};

function TabElement({ routeName, icon, iconFocused }: TabElementProps) {
  const { navigateTo, focusedTab } = useTabNavigationContext();

  const focused = useMemo(() => focusedTab === routeName, [focusedTab, routeName]);
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();

  const badgeColor = useServerStatusColor();

  const COLOR = colors.TEXT_LIGHT;
  const FOCUSED_COLOR = colors.SECONDARY;

  const onPress = () => {
    if (!focused) {
      navigateTo(routeName);
    }
  };

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
      <View style={styles.tabElementView}>
        <View>
          <Icon
            name={focused ? iconFocused.name : icon.name}
            type={focused ? iconFocused.type : icon.type}
            size={ICON_SIZE}
            color={focused ? FOCUSED_COLOR : COLOR}
          />
          {routeName === TabName.Server && (
            <Badge
              badgeStyle={{
                backgroundColor: badgeColor,
              }}
              containerStyle={{ position: 'absolute', top: -2, right: -2 }}
            />
          )}
        </View>
        <Text style={[styles.label, focused ? { color: FOCUSED_COLOR } : { color: COLOR }]}>
          {routeName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function TabBarPadding() {
  return <View style={{ height: TAB_BAR_HEIGHT }} />;
}

const TAB_BAR_HEIGHT = 80;
const ICON_SIZE = 22;

const makeStyles = (colors: colorsType) =>
  StyleSheet.create({
    tabElementView: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    label: {
      ...typography(colors).tabBarLabel,
      paddingTop: 4,
    },
    tabView: {
      height: TAB_BAR_HEIGHT,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      shadowColor: colors.TEXT,
      backgroundColor: colors.BACKGROUND,
      elevation: 12,
    },
    container: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },
  });
