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
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import colors from "~/colors";

type BackButtonProps = {
  style?: any;
};

export default function BackButton(props: BackButtonProps) {
  const navigation = useNavigation();
  return (
    <View style={[styles.backButtonStyle, props.style]}>
      <Icon
        name="arrow-back-ios"
        color={"black"}
        size={22}
        style={styles.backIconStyle}
        onPress={() => {
          navigation.goBack();
        }}
        underlayColor={colors.underlayColor}
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
