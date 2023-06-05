import React, { useState, useCallback, useEffect } from "react";

import {
  StyleSheet,
  StatusBar,
  View,
  Button,
  FlatList,
  Dimensions,
} from "react-native";

import {
  GetMorePhotosLocal,
  GetMorePhotosServer,
} from "~/Helpers/GetMorePhotos";

import notifee from "@notifee/react-native";
import { NativeModules } from "react-native";
const { MainModule } = NativeModules;

import { PhotoType } from "~/Helpers/types";
import PhotoComponentForGrid from "../../Components/PhotoComponentForGrid";

const ITEM_HEIGHT = Dimensions.get("screen").width / 3;

function keyExtractor(item: PhotoType) {
  return `grid_${item.id}`;
}

function getItemLayout(data: any, index: number) {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
}

export default function TestScreen() {
  const [a, setA] = useState(0);
  const [photos, setPhotos] = useState<Array<PhotoType>>([]);

  const f = async () => {
    const newPhotos = await GetMorePhotosLocal(15, 0);
    setPhotos(newPhotos.photos);
  };

  useEffect(() => {
    f();
  }, []);

  async function press() {
    setPhotos((p) => {
      const nP = [...p];
      nP.shift();
      return nP;
    });
  }

  const renderItem = useCallback(({ item }: { item: PhotoType }) => {
    return (
      <PhotoComponentForGrid
        key={`grid_${item.id}`}
        photo={item}
        isSelected={false}
        isSelecting={false}
      />
    );
  }, []);

  return (
    <View>
      <View style={{ marginTop: 0 }}>
        <Button onPress={press} title="test button" />
        <FlatList
          style={styles.flatListStyle}
          data={photos}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          //numColumns={3}
          getItemLayout={getItemLayout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewStyle: { height: "100%", width: "100%" },
  flatListStyle: {},
  textOnEmpty: {
    fontSize: 15,
    textAlign: "center",
  },
  viewOnEmpty: {},
  viewHeader: { paddingVertical: 30 },
  textHeader: { fontSize: 17, textAlign: "center" },
  viewFooter: { marginVertical: 35 },
});
