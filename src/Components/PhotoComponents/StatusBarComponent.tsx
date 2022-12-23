import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
} from "react-native";

import { Icon } from "@rneui/themed";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "~/colors";

export default function StatusBarComponent() {
  return (
    <View style={styles.statusBarComponentStyle}>
      <StatusComponent icon="mobile-friendly" text="On device" />
      <StatusComponent icon="cloud-done" text="Backed up" />
    </View>
  );
}

function StatusComponent(props: { icon: string; text: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.lightgrey,
        padding: 5,
        borderRadius: 20,
        marginHorizontal: 3,
      }}
    >
      <Icon name={props.icon} containerStyle={{ padding: 5 }} size={20} />
      <Text style={{ paddingHorizontal: 3, fontWeight: "700" }}>
        {props.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBarComponentStyle: {
    margin: 15,
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
  },
});
