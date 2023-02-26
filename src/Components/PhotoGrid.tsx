import { StyleSheet, Text, View, FlatList } from "react-native";

import { useCallback, useEffect, useState } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoComponentForGrid from "./PhotoComponentForGrid";

type PropsType = {
  photos: PhotoType[];
  onEndReached: () => void;
  title?: string;
  onPhotoClicked?: (photo: PhotoType) => void;
};

const ItemsToLoadPerEndReached = 200;

export default function PhotoGrid(props: PropsType) {
  console.log("PhotoGrid: Render");
  const PhotoPressed = props.onPhotoClicked ?? ((photo: PhotoType) => {});

  const renderItem = useCallback(
    ({ item, index }: { item: PhotoType; index: number }) => (
      <PhotoComponentForGrid
        photo={item}
        onPress={() => PhotoPressed(props.photos[index])}
        index={index}
      />
    ),
    [props.photos]
  );

  return (
    <FlatList
      style={styles.flatListStyle}
      data={props.photos}
      renderItem={renderItem}
      maxToRenderPerBatch={20}
      initialNumToRender={20}
      keyExtractor={(item, index) =>
        `Photo_${item.image.fileName}_index_${index}`
      }
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        console.log("PhotoGrid: onEndReached");
        props.onEndReached();
      }}
      onRefresh={() => {}}
      refreshing={false}
      numColumns={3}
      ListHeaderComponent={() =>
        props.title ? (
          <Text style={styles.titleStyle}>{props.title}</Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    color: "grey",
    paddingBottom: 15,
  },
  flatListStyle: {},
});
