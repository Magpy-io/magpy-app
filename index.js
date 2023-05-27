/**
 * @format
 */
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import * as Queries from "~/Helpers/Queries";
import notifee, { EventType } from "@notifee/react-native";

AppRegistry.registerComponent(appName, () => App);

notifee.registerForegroundService((notification) => {
  return new Promise(async () => {
    let i = 0;
    while (true) {
      Queries.getPhotos(0, i++, "data");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
});
