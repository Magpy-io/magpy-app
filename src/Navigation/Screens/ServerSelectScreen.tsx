import { useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
  View,
} from "react-native";
import Zeroconf from "react-native-zeroconf";
import type { Service } from "react-native-zeroconf";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import NetworkConfig from "~/Global/networkConfig";

const zeroconf = new Zeroconf();

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [services, setServices] = useState<Service[]>(new Array<Service>());

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    refreshData();

    zeroconf.on("start", () => {
      setIsScanning(true);
    });

    zeroconf.on("stop", () => {
      setIsScanning(false);
    });

    zeroconf.on("resolved", (service) => {
      if (service.name.startsWith("OpenCloud-server")) {
        setServices((oldServices) => {
          return [...oldServices, service];
        });
      }
    });

    zeroconf.on("error", (err) => {
      setIsScanning(false);
      console.log("[Error]", err);
    });
  }, []);

  const renderRow = ({ item, index }: { item: Service; index: number }) => {
    const { name, host, port } = services[index];

    return (
      <TouchableOpacity
        onPress={() => {
          NetworkConfig.port = port;
          NetworkConfig.ipAdress = host;
          NetworkConfig.isSet = true;
          navigation.navigate("Server");
        }}
      >
        <Text>{name}</Text>
        <Text>{host}</Text>
        <Text>{port}</Text>
      </TouchableOpacity>
    );
  };

  const refreshData = () => {
    if (isScanning) {
      return;
    }

    setServices([]);
    zeroconf.scan("http", "tcp", "local.");

    setTimeout(() => {
      zeroconf.stop();
    }, 5000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={services}
        renderItem={renderRow}
        keyExtractor={(key, index) => key.fullName + index.toString()}
        onRefresh={refreshData}
        refreshing={false}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "black",
                marginVertical: 10,
              }}
            />
          );
        }}
      />
      <Text style={styles.state}>{isScanning ? "Scanning..." : ""}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  closeButton: {
    padding: 20,
    textAlign: "center",
  },
  json: {
    padding: 10,
  },
  state: {
    fontSize: 20,
    textAlign: "center",
    margin: 30,
  },
});
