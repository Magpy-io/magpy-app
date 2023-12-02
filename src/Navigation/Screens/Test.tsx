import { useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
} from "react-native";
import Zeroconf from "react-native-zeroconf";
import type { Service } from "react-native-zeroconf";

const zeroconf = new Zeroconf();

export default function App() {
  let timeout: NodeJS.Timeout;

  const [isScanning, setIsScanning] = useState(false);
  const [selectedService, setSelectedService] = useState(-1);
  const [services, setServices] = useState<Service[]>(new Array<Service>());

  useEffect(() => {
    refreshData();

    zeroconf.on("start", () => {
      setIsScanning(true);
      console.log("[Start]");
    });

    zeroconf.on("stop", () => {
      setIsScanning(false);
      console.log("[Stop]");
    });

    zeroconf.on("resolved", (service) => {
      setServices((oldServices) => {
        return [...oldServices, service];
      });
      console.log("[Resolve]", JSON.stringify(service, null, 2));
    });

    zeroconf.on("error", (err) => {
      setIsScanning(false);
      console.log("[Error]", err);
    });
  }, []);

  const renderRow = ({ item, index }: { item: Service; index: number }) => {
    const { name, fullName, host, port } = services[index];

    return (
      <TouchableOpacity onPress={() => setSelectedService(index)}>
        <Text>{name}</Text>
        <Text>{fullName}</Text>
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

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      zeroconf.stop();
    }, 5000);
  };

  if (selectedService >= 0) {
    const service = services[selectedService];
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedService(-1)}>
          <Text style={styles.closeButton}>{"CLOSE"}</Text>
        </TouchableOpacity>

        <Text style={styles.json}>{JSON.stringify(services, null, 2)}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.state}>{isScanning ? "Scanning.." : "Stopped"}</Text>

      <FlatList
        data={services}
        renderItem={renderRow}
        keyExtractor={(key, index) => key.fullName + index.toString()}
        onRefresh={refreshData}
        refreshing={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
