import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import colors from "~/colors";

const TopTabBar = ({ navigation, state }: MaterialTopTabBarProps) => {
  function onSelect(index: number) {
    navigation.navigate(state.routeNames[index]);
  }

  return (
    <View style={styles.tabBar}>
      <TopBarTab
        onSelect={onSelect}
        index={0}
        selected={state.index === 0}
        title="Server"
      />
      <TopBarTab
        onSelect={onSelect}
        index={1}
        selected={state.index === 1}
        title="Local"
      />
    </View>
  );
};

function TopBarTab(props: {
  title: string;
  index: number;
  onSelect: (index: any) => void;
  selected: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onSelect(props.index);
      }}
    >
      <Text style={[styles.tab, props.selected ? styles.tabSelected : {}]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 50,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  tab: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tabSelected: { color: colors.tabBarHighlight },
});

export default TopTabBar;
