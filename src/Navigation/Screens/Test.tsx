import React, { useState } from "react";

import { StatusBar, View, Button } from "react-native";

import notifee from "@notifee/react-native";
import { NativeModules } from "react-native";
const { MainModule } = NativeModules;

export default function TestScreen() {
  const [a, setA] = useState(0);

  async function onDisplayNotification() {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    notifee.displayNotification({
      title: "Foreground service",
      body: "This notification will exist for the lifetime of the service runner",
      android: {
        channelId,
        asForegroundService: true,
        actions: [
          {
            title: "Stop",
            pressAction: {
              id: "stop",
            },
          },
        ],
      },
    });
  }

  const f = () => {
    MainModule.startSendingMediaService([]);
  };

  return (
    <View>
      <View style={{ width: 150, marginTop: 200 }}>
        <Button onPress={onDisplayNotification} title="test button" />
      </View>
    </View>
  );
}
