import React, { useState, useEffect } from 'react';
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
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  CameraRoll,
  Album,
  PhotoIdentifier,
} from "@react-native-camera-roll/camera-roll";
import { Image } from 'react-native-elements';
async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;


  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === "granted";
}



import colors from '../colors';

const IMG =
  'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=';

type PhotoGridProps = {};

const RenderItem = ({ item, index }: { item: any; index: number }) => (
  <View style={styles.itemStyle}>
    <Image
      source={{
        uri: IMG,
      }}
      style={styles.imageStyle}
      containerStyle={styles.imageContainerStyle}
    />
  </View>
);

export default function PhotoGrid(props: PhotoGridProps) {
  const data = new Array(102).fill(null);

  const title = 'Mes photos';
  return (
    <View style={styles.viewStyle}>
      <Text>{edges?.length}</Text>
      <FlatList
        style={styles.flatListStyle}
        data={data}
        renderItem={RenderItem}
        keyExtractor={(item) => String(item)}
        numColumns={3}
        ListHeaderComponent={() => (
          <Text style={styles.titleStyle}>{title}</Text>
        )}
      />
    </View>
  );
}

const MARGIN = 1;
const BORDER_RADIUS = 0;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color: colors.grey,
    paddingBottom: 15,
  },
  viewStyle: {
    flex: 1,
    margin: MARGIN,
  },
  flatListStyle: {},
  itemStyle: {
    padding: MARGIN,
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
  },
  itemTextStyle: { textAlign: 'center' },
  imageStyle: {
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
    borderRadius: BORDER_RADIUS,
  },
  imageContainerStyle: { overflow: 'hidden' },
});
