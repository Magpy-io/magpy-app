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
  onPostPhoto: (index: number) => void;
  RequestFullPhoto: (index: number) => void;
  startIndex: number;
  onPhotoClicked?: (index: number) => void;
  onDeleteAddLocal?: (index: number) => void;
  onDeleteAddServer?: (index: number) => void;
  onShare?: (index: number) => void;
  onDetails?: (index: number) => void;
};

export default function PhotoGrid(props: PropsType) {
  console.log("PhotoSlider: Render");

  const flatlistRef = useRef<FlatList>(null);
  const flatListCurrentIndexRef = useRef<number>(props.startIndex);
  const [flatListCurrentIndex, setFlatListCurrentIndex] = useState(
    props.startIndex
  );

  const renderItem = useCallback(
    ({ item, index }: { item: PhotoType; index: number }) => (
      <PhotoComponentForSlider
        photo={item}
        onPress={() => props.onPhotoClicked?.(index)}
        onLongPress={() => props.onPostPhoto(index)}
        index={index}
      />
    ),
    [props.photos]
  );

  useEffect(() => {
    if (props.photos.length == 0) {
      return;
    }

    let indexToScroll = flatListCurrentIndex;
    if (flatListCurrentIndex >= props.photos.length) {
      indexToScroll = props.photos.length - 1;
    }

    flatlistRef.current?.scrollToIndex({
      animated: false,
      index: indexToScroll,
    });
  }, [props.photos.length, flatListCurrentIndex]);

  useEffect(() => {
    if (props.photos.length == 0) {
      props.onSwitchMode(0);
      return;
    }
    if (flatListCurrentIndex >= props.photos.length) {
      setFlatListCurrentIndex(props.photos.length - 1);
      return;
    }

    console.log(flatListCurrentIndex);
    console.log(props.photos.length);
    if (!props.photos[flatListCurrentIndex].inDevice) {
      props.RequestFullPhoto(flatListCurrentIndex);
    }
  }, [flatListCurrentIndex, props.photos, props.onSwitchMode]);

  useEffect(() => {
    const backAction = () => {
      props.onSwitchMode(flatListCurrentIndexRef.current);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [props.onSwitchMode]);

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
        console.log(index);
        flatListCurrentIndexRef.current = index;
        setFlatListCurrentIndex(index);
      }
    },
    []
  );

  return (
    <>
      <View style={styles.centeringViewStyle}>
        <FlatList
          style={styles.flatListStyle}
          ref={flatlistRef}
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
        photos={props.photos}
        index={flatListCurrentIndex}
        onDeleteAddLocal={props.onDeleteAddLocal}
        onDeleteAddServer={props.onDeleteAddServer}
        onDetails={props.onDetails}
        onShare={props.onShare}
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
