import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Icon, Text } from 'react-native-elements';

import { TabName, useTabNavigationContext } from '~/Context/TabNavigationContext';
import { appColors, colors } from '~/styles/colors';

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

  const onPress = () => {
    if (!focused) {
      navigateTo(routeName);
    }
  };

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
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
    </TouchableOpacity>
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
    paddingBottom: 20, //TODO Bar height here
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
