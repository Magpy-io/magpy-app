import { StyleSheet, Text, View, PixelRatio } from "react-native";

import CancelButton from "~/Components/CommonComponents/CancelButton";
import SelectAllButton from "~/Components/CommonComponents/SelectAllButton";
import React from "react";
import * as BarHeights from "~/Helpers/BarHeights";

type StatusBarComponentProps = {
  selectedNb: number;
  style?: any;
  onCancelButton?: () => void;
  onSelectAllButton?: () => void;
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

      <Text style={styles.textElementsSelectedStyle}>
        {selectedElementsToString(props.selectedNb)}
      </Text>

      <View style={styles.statusBarSelectAllButtonStyle}>
        <SelectAllButton onPress={props.onSelectAllButton} />
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
    marginTop: BarHeights.GetStatusBarHeight(),
  },
  statusBarCancelButtonStyle: {},
  statusBarSelectAllButtonStyle: {},
  textElementsSelectedStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});

export default React.memo(StatusBarGridComponent);
