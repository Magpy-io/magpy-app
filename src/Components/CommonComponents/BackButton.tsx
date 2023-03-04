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
  onPress?: () => void;
};

export default function BackButton(props: BackButtonProps) {
  const navigation = useNavigation();
  return (
    <View style={[styles.backButtonStyle, props.style]}>
      <Icon
        name="arrow-back-ios"
        color={"black"}
        size={26}
        style={styles.backIconStyle}
        onPress={() => {
          if (props.onPress) {
            props.onPress();
          } else {
            navigation.goBack();
          }
        }}
        underlayColor={colors.underlayColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backIconStyle: {},
  backButtonStyle: { padding: 5 },
});
