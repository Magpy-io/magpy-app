import {
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  BackHandler,
  ViewToken,
  View,
} from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";
import { PhotoType } from "~/Helpers/types";
import PhotoComponentForSlider from "./PhotoComponentForSlider";
import StatusBarComponent from "./PhotoComponents/StatusBarComponent";
import ToolBar from "./PhotoComponents/ToolBar";

const ITEM_WIDTH = Dimensions.get("window").width;

type PropsType = {
  photos: PhotoType[];
  onSwitchMode: (index: number) => void;
  onEndReached: () => void;
  onPostPhoto: (photo: PhotoType) => void;
  RequestFullPhoto: (index: number) => void;
  startIndex: number;
  onPhotoClicked?: (photo: PhotoType) => void;
};

export default function PhotoGrid(props: PropsType) {
  console.log("PhotoSlider: Render");

  const [flatListCurrentIndex, setFlatListCurrentIndex] = useState(
    props.startIndex
  );

  const PhotoPressed = props.onPhotoClicked ?? ((photo: PhotoType) => {});

  const renderItem = useCallback(
    ({ item, index }: { item: PhotoType; index: number }) => (
      <PhotoComponentForSlider
        photo={item}
        onPress={() => PhotoPressed(props.photos[index])}
        onLongPress={() => props.onPostPhoto(props.photos[index])}
        index={index}
      />
    ),
    [props.photos]
  );

  useEffect(() => {
    const backAction = () => {
      props.onSwitchMode(flatListCurrentIndex);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const onViewableItemsChangedCallBack = useCallback(
    ({
      viewableItems,
      changed,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (viewableItems.length == 1) {
        const index = viewableItems[0].index ?? 0;
        setFlatListCurrentIndex(index);
        if (!props.photos[index].inDevice) {
          props.RequestFullPhoto(index);
        }
      }
    },
    []
  );

  return (
    <>
      <View style={styles.centeringViewStyle}>
        <FlatList
          style={styles.flatListStyle}
          data={props.photos}
          renderItem={renderItem}
          initialNumToRender={1}
          initialScrollIndex={props.startIndex}
          onViewableItemsChanged={onViewableItemsChangedCallBack}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 90,
          }}
          horizontal={true}
          snapToAlignment="start"
          disableIntervalMomentum={true}
          decelerationRate={"normal"}
          showsHorizontalScrollIndicator={false}
          snapToInterval={Dimensions.get("screen").width}
          keyExtractor={(item, index) =>
            `Photo_${item.image.fileName}_index_${index}`
          }
          onEndReachedThreshold={5}
          onEndReached={() => {
            console.log("PhotoSlider: onEndReached");
            props.onEndReached();
          }}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
        />
      </View>
      <StatusBarComponent
        style={styles.statusBarStyle}
        photo={props.photos[flatListCurrentIndex]}
        onBackButton={() => props.onSwitchMode(flatListCurrentIndex)}
      />
      <ToolBar
        style={styles.toolBarStyle}
        photo={props.photos[props.startIndex]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centeringViewStyle: {
    backgroundColor: "white",
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  flatListStyle: { backgroundColor: "white" },
  statusBarStyle: { position: "absolute", top: 0 },
  toolBarStyle: { position: "absolute", bottom: 0 },
});
