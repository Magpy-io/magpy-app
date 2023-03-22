import { StyleSheet, Text, FlatList, Dimensions, View } from "react-native";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoComponentForGrid from "./PhotoComponentForGrid";

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
  photos: Array<PhotoType>;
  startIndex: number;
  onSwitchMode: (index: number) => void;
  onRefresh: () => void;
  fetchMore?: () => void;
};

export default function PhotoGrid(props: PropsType) {
  const flatlistRef = useRef<FlatList>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [seletedIds, setSelectedIds] = useState(new Map());

  const onRenderItemPress = useCallback(
    (item: PhotoType, index: number) => {
      if (isSelecting) {
        setSelectedIds((sIds) => {
          if (sIds.has(item.id)) {
            const newMap = new Map(sIds);
            newMap.delete(item.id);
            return newMap;
          } else {
            const newMap = new Map(sIds);
            newMap.set(item.id, true);
            return newMap;
          }
        });
      } else {
        props.onSwitchMode(index);
      }
    },
    [props.onSwitchMode, isSelecting]
  );

  const onRenderItemLongPress = useCallback(
    (item: PhotoType, index: number) => {
      if (!isSelecting) {
        setIsSelecting(true);
        const map = new Map();
        map.set(item.id, true);
        setSelectedIds(map);
      }
    },
    [isSelecting]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: PhotoType; index: number }) => (
      <PhotoComponentForGrid
        photo={item}
        index={index}
        isSelecting={isSelecting}
        isSelected={seletedIds.has(item.id)}
        onPress={onRenderItemPress}
        onLongPress={onRenderItemLongPress}
      />
    ),
    [onRenderItemPress, onRenderItemLongPress, isSelecting, seletedIds]
  );

  let correctStartIndex = Math.floor(props.startIndex / 3);

  if (props.startIndex >= props.photos.length) {
    correctStartIndex = Math.floor((props.photos.length - 1) / 3);
  }

  useEffect(() => {
    const noItemsSelected = seletedIds.size == 0;
    if (noItemsSelected) {
      setIsSelecting(() => false);
    }
  }, [seletedIds]);

  useEffect(() => {
    if (props.photos.length == 0) {
      props.onRefresh();
    }
  }, [props.photos.length]);

  return (
    <FlatList
      ref={flatlistRef}
      style={styles.flatListStyle}
      data={props.photos}
      renderItem={renderItem}
      maxToRenderPerBatch={20}
      initialNumToRender={20}
      initialScrollIndex={correctStartIndex}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={1}
      onEndReached={props.fetchMore}
      onRefresh={props.onRefresh}
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
