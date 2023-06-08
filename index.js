import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import * as Queries from "~/Helpers/Queries";

import { NativeModules } from "react-native";
const { MainModule } = NativeModules;

AppRegistry.registerComponent(appName, () => App);

const f = async (p) => {
  await new Promise((r) => setTimeout(r, 2000));

  const x = Math.floor(Math.random() * 100);

  console.log(x);
  if (x > 80) {
    MainModule.onJsTaskFinished({ code: "ERROR" });
  } else {
    MainModule.onJsTaskFinished({ code: "SUCCESS" });
  }

  console.log(p);
};

AppRegistry.registerHeadlessTask("MyTask", () => f);
