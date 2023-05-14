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
