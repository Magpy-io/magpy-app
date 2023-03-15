import { StyleSheet, Text, FlatList, Dimensions } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoComponentForGrid from "./PhotoComponentForGrid";

const ITEM_HEIGHT = Dimensions.get("window").width / 3;

type PropsType = {
  photos: PhotoType[];
  onEndReached: () => void;
  onSwitchMode: (index: number) => void;
  onPostPhoto: (index: number) => void;
  startIndex: number;
  onPhotoClicked?: (index: number) => void;
  onRefresh: () => void;
};

export default function PhotoGrid(props: PropsType) {
  console.log("PhotoGrid: Render");

  const flatlistRef = useRef<FlatList>(null);
  const photosLenRef = useRef<number>(props.photos.length);

  const PhotoPressed = (index: number) => {
    props.onSwitchMode(index);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: PhotoType; index: number }) => (
      <PhotoComponentForGrid
        photo={item}
        onPress={() => PhotoPressed(index)}
        onLongPress={() => props.onPostPhoto(index)}
        index={index}
      />
    ),
    [props.photos]
  );

  useEffect(() => {
    if (photosLenRef.current == 0) {
      return;
    }

    let indexToScroll = Math.floor(props.startIndex / 3);
    if (indexToScroll >= photosLenRef.current) {
      indexToScroll = Math.floor((photosLenRef.current - 1) / 3);
    }

    flatlistRef.current?.scrollToIndex({
      animated: false,
      index: indexToScroll,
    });
  }, [props.startIndex]);

  useEffect(() => {
    if (props.photos.length == 0) {
      props.onEndReached();
    }
    photosLenRef.current = props.photos.length;
  }, [props.photos.length]);

  return (
    <FlatList
      ref={flatlistRef}
      style={styles.flatListStyle}
      data={props.photos}
      renderItem={renderItem}
      maxToRenderPerBatch={20}
      initialNumToRender={20}
      keyExtractor={(item, index) =>
        `Photo_${item.image.fileName}_index_${index}`
      }
      onEndReachedThreshold={1}
      onEndReached={() => {
        console.log("PhotoGrid: onEndReached");
        props.onEndReached();
      }}
      onRefresh={props.onRefresh}
      refreshing={false}
      numColumns={3}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  flatListStyle: {},
});
