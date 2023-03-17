import React, { useState } from "react";

import { StatusBar, View, Button } from "react-native";

export default function TestScreen() {
  const f = () => {
    console.log("hi");
  };

  return (
    <View>
      <View style={{ width: 150, marginTop: 200 }}>
        <Button onPress={f} title="test button" />
      </View>
    </View>
  );
}
