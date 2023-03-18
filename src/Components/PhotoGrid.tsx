import { StyleSheet, Text, FlatList, Dimensions, View } from "react-native";
import { useCallback, useContext, useEffect, useRef } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoComponentForGrid from "./PhotoComponentForGrid";

import {
  ContextSourceTypes,
  useSelectedContext,
} from "~/Components/ContextProvider";

const ITEM_HEIGHT = Dimensions.get("screen").width / 3;

const listEmptyComponent = () => {
  return (
    <View style={styles.viewOnEmpty}>
      <Text style={styles.textOnEmpty}>No Data</Text>
    </View>
  );
};

type PropsType = {
  contextSource: ContextSourceTypes;
  photos: PhotoType[];
  startIndex: number;
  onSwitchMode: (index: number) => void;
};

export default function PhotoGrid(props: PropsType) {
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
        //onLongPress={() => props.onPostPhoto(index)}
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
      initialScrollIndex={Math.floor(props.startIndex / 3)}
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
      ListEmptyComponent={listEmptyComponent}
    />
  );
}

const styles = StyleSheet.create({
  flatListStyle: {},
  textOnEmpty: {
    fontSize: 15,
    textAlign: "center",
  },
  viewOnEmpty: {},
});
