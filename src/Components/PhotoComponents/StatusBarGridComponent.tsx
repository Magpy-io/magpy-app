import { StyleSheet, Text, View } from "react-native";

import { Icon } from "@rneui/themed";
import colors from "~/colors";
import CancelButton from "~/Components/CommonComponents/CancelButton";
import React from "react";
import * as Progress from "react-native-progress";

type StatusBarComponentProps = {
  selectedNb: number;
  style?: any;
  onCancelButton?: () => void;
};

function selectedElementsToString(n: number) {
  if (!n) {
    return "No Elements Selected";
  }

  if (n == 1) {
    return "1 Element Selected";
  }

  return `${n} Elements Selected`;
}

function StatusBarGridComponent(props: StatusBarComponentProps) {
  return (
    <View style={[styles.StatusBarStyle, props.style]}>
      <View style={styles.statusBarCancelButtonStyle}>
        <CancelButton onPress={props.onCancelButton} />
      </View>

      <View style={styles.elementsSelectedViewStyle}>
        <Text style={styles.textElementsSelectedStyle}>
          {selectedElementsToString(props.selectedNb)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  StatusBarStyle: {
    padding: 5,
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
  },
  statusBarCancelButtonStyle: {},
  elementsSelectedViewStyle: {
    flex: 1,
    alignItems: "center",
  },
  textElementsSelectedStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});

export default React.memo(StatusBarGridComponent);
