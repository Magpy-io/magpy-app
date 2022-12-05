import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  PermissionsAndroid,
  View,
  Button,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RNFS from "react-native-fs";

const data = new Array(102).fill(null).map((v: number, i: number) => i);

const _renderItem = (n: number) => (
  <View style={styles.itemStyle}>
    <Image
      source={{
        uri: "https://pbs.twimg.com/profile_images/486929358120964097/gNLINY67_400x400.png",
      }}
      style={{ width: 100, height: 100 }}
    />
  </View>
);

export default function PhotoGrid(props: Object) {
  useEffect(() => {});

  return (
    <View style={styles.viewStyle}>
      <FlatList
        style={styles.flatListStyle}
        data={data}
        renderItem={(item) => _renderItem(item.item)}
        keyExtractor={(item) => String(item)}
        numColumns={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    //  backgroundColor: "red",
  },

  flatListStyle: {
    //    backgroundColor: "blue",

    marginVertical: 30,
  },

  itemStyle: {
    padding: 5,
    borderWidth: 2,
    margin: 5,
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
  },

  itemTextStyle: { textAlign: "center" },
});
