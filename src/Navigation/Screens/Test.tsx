import React, { useState } from "react";

import { StatusBar, View, Button } from "react-native";

export default function TestScreen() {
  const [b, setB] = useState(false);

  return (
    <View>
      <StatusBar hidden={b} />
      <View style={{ width: 150, marginTop: 200 }}>
        <Button onPress={() => setB((r) => !r)} title="Toogle StatusBar" />
      </View>
    </View>
  );
}
