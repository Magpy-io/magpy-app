import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { Icon, Text } from 'react-native-elements';

import { useTabNavigationContext } from '~/Context/TabNavigationContext';
import * as BarHeights from '~/Helpers/BarHeights';
import { appColors, colors } from '~/styles/colors';

import { Tab } from './Navigation';

type IconType = { name: string; type: string };
type RouteType = {
  name: Tab;
  icon: IconType;
  iconFocused: IconType;
};

const routes: RouteType[] = [
  {
    name: Tab.Server,
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
    name: Tab.Home,
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
    name: Tab.Settings,
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
  const { focusedTab, hidden } = useTabNavigationContext();
  if (hidden) {
    return <View />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.tabView}>
        {routes.map(route => {
          return (
            <TabElement
              key={route.name}
              routeName={route.name}
              icon={route.icon}
              iconFocused={route.iconFocused}
              focused={focusedTab === route.name}
            />
          );
        })}
      </View>
    </View>
  );
}

type TabElementProps = {
  routeName: Tab;
  icon: IconType;
  iconFocused: IconType;
  focused: boolean;
};

function TabElement({ routeName, icon, iconFocused, focused }: TabElementProps) {
  const { navigateTo } = useTabNavigationContext();
  console.log('routename', routeName);
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => navigateTo(routeName)}>
      <View style={styles.tabElementView}>
        <Icon
          name={focused ? iconFocused.name : icon.name}
          type={focused ? iconFocused.type : icon.type}
          size={ICON_SIZE}
          color={focused ? FOCUSED_COLOR : COLOR}
        />
        <Text style={[styles.label, focused ? { color: FOCUSED_COLOR } : { color: COLOR }]}>
          {routeName}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const COLOR = colors.LIGHT_GREEN;
const FOCUSED_COLOR = appColors.PRIMARY;
const ICON_SIZE = 22;

const styles = StyleSheet.create({
  tabElementView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingTop: 4,
  },
  tabView: {
    height: 120,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: BarHeights.GetNavigatorBarHeight(),
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
