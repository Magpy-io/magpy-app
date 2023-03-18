import { StyleSheet, Text, FlatList, Dimensions, View } from "react-native";
import { useCallback, useContext, useEffect, useRef } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoComponentForGrid from "./PhotoComponentForGrid";

import {
  ContextSourceTypes,
  useSelectedContext,
} from "~/Components/ContextProvider";

const ITEM_HEIGHT = Dimensions.get("screen").width / 3;

function keyExtractor(item: PhotoType, index: number) {
  return `Photo_${item.image.fileName}_index_${index}`;
}

function getItemLayout(data: any, index: number) {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
}

const listEmptyComponent = () => {
  return (
    <View style={styles.viewOnEmpty}>
      <Text style={styles.textOnEmpty}>No Data</Text>
    </View>
  );
};

type PropsType = {
  contextSource: ContextSourceTypes;
  startIndex: number;
  onSwitchMode: (index: number) => void;
};

export default function PhotoGrid(props: PropsType) {
  const context = useSelectedContext(props.contextSource);

  const flatlistRef = useRef<FlatList>(null);

  const renderItem = useCallback(
    ({ item, index }: { item: PhotoType; index: number }) => (
      <PhotoComponentForGrid
        photo={item}
        onPress={() => props.onSwitchMode(index)}
      />
    ),
    [props.onSwitchMode]
  );

  let correctStartIndex = Math.floor(props.startIndex / 3);

  if (props.startIndex >= context.photos.length) {
    correctStartIndex = Math.floor((context.photos.length - 1) / 3);
  }

  useEffect(() => {
    if (context.photos.length == 0) {
      context.onRefresh();
    }
  }, [context.photos.length]);

  return (
    <FlatList
      ref={flatlistRef}
      style={styles.flatListStyle}
      data={context.photos}
      renderItem={renderItem}
      maxToRenderPerBatch={20}
      initialNumToRender={20}
      initialScrollIndex={correctStartIndex}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={1}
      onEndReached={context.fetchMore}
      onRefresh={context.onRefresh}
      refreshing={false}
      numColumns={3}
      getItemLayout={getItemLayout}
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
