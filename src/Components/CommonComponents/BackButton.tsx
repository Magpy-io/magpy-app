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

export default function BackButton() {
  return (
    <View style={styles.backButtonStyle}>
      <Icon
        name="arrow-back-ios"
        color={"black"}
        size={22}
        style={styles.backIconStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backIconStyle: {
    padding: 15,
  },
  backButtonStyle: {
    margin: 10,
    position: "absolute",
    top: 0,
    left: 0,
  },
});
