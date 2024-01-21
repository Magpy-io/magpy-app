import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';

import { colorsOld as colors } from '~/styles/colors';

const TopTabBar = ({ navigation, state }: MaterialTopTabBarProps) => {
  function onSelect(index: number) {
    navigation.navigate(state.routeNames[index]);
  }

  return (
    <View style={styles.tabBar}>
      <TopBarTab onSelect={onSelect} index={0} selected={state.index === 0} title="Server" />
      <TopBarTab onSelect={onSelect} index={1} selected={state.index === 1} title="Local" />
    </View>
  );
};

function TopBarTab(props: {
  title: string;
  index: number;
  onSelect: (index: number) => void;
  selected: boolean;
}) {
  return (
    <TouchableHighlight
      onPress={() => {
        props.onSelect(props.index);
      }}
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      style={styles.touchable}>
      <Text style={[styles.tab, props.selected ? styles.tabSelected : {}]}>{props.title}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tab: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabSelected: { color: colors.tabBarHighlight },
  touchable: {
    height: '100%',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TopTabBar;
