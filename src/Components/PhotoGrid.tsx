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
} from 'react-native';

import { Image } from 'react-native-elements';

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
  const data = new Array(102).fill(null).map((v: number, i: number) => i);

  const title = 'Mes photos';
  return (
    <View style={styles.viewStyle}>
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
