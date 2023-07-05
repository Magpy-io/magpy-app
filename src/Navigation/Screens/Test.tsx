import React, { useState, useCallback, useEffect } from "react";

import {
  StyleSheet,
  StatusBar,
  View,
  Button,
  FlatList,
  Dimensions,
} from "react-native";

import {
  GetMorePhotosLocal,
  GetMorePhotosServer,
} from "~/Helpers/GetMorePhotos";

import { useRef, createRef } from "react";
import { Text, Image, Animated } from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useMainContext } from "~/Components/ContextProvider";
import PhotoGallery from "~/Components/PhotoGallery";

import notifee from "@notifee/react-native";
import { NativeModules } from "react-native";
const { MainModule } = NativeModules;

import { PhotoType } from "~/Helpers/types";
import PhotoComponentForGrid from "../../Components/PhotoComponentForGrid";

function photosNbToString(n: number) {
  if (!n) {
    return "All media is backed up.";
  }
  if (n == 1) {
    return "1 Photo ready for backup.";
  }
  return `${n} Photos ready for backup.`;
}

const ITEM_HEIGHT = Dimensions.get("screen").width / 3;

function keyExtractor(item: PhotoType) {
  return `grid_${item.id}`;
}

function getItemLayout(data: any, index: number) {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
}

export default function TestScreen() {
  const [a, setA] = useState(0);
  const [photos, setPhotos] = useState<Array<PhotoType>>([]);

  const [panEnabled, setPanEnabled] = useState(false);

  //const scaleRef = useRef(new Animated.Value(1));
  const translateXRef = useRef(new Animated.Value(0));
  const translateYRef = useRef(new Animated.Value(0));

  let s = new Animated.Value(1);

  console.log("dffd");

  const pinchRef = createRef();
  const panRef = createRef();

  const context = useMainContext();

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: { scale: s },
      },
    ],
    { useNativeDriver: true }
  );

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateXRef.current,
          translationY: translateYRef.current,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const handlePinchStateChange = ({ nativeEvent }) => {
    // enabled pan only after pinch-zoom
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true);
    }

    // when scale < 1, reset scale back to original (1)
    const nScale = nativeEvent.scale;
    // if (nativeEvent.state === State.END) {
    //   if (nScale < 1) {
    //     Animated.spring(scaleRef.current, {
    //       toValue: 1,
    //       useNativeDriver: true,
    //     }).start();
    //     Animated.spring(translateXRef.current, {
    //       toValue: 0,
    //       useNativeDriver: true,
    //     }).start();
    //     Animated.spring(translateYRef.current, {
    //       toValue: 0,
    //       useNativeDriver: true,
    //     }).start();

    //     setPanEnabled(false);
    //   }
    // }
  };

  return (
    <View style={{ backgroundColor: "black" }}>
      {/* <PanGestureHandler
        onGestureEvent={onPanEvent}
        ref={panRef}
        //simultaneousHandlers={[pinchRef]}
        //enabled={true}
        failOffsetX={[-1000, 1000]}
        //shouldCancelWhenOutside
      >
        <Animated.View style={{ height: 300, width: 300 }}> */}
      <PinchGestureHandler
        ref={pinchRef}
        onGestureEvent={onPinchEvent}
        //simultaneousHandlers={[panRef]}
        //onHandlerStateChange={handlePinchStateChange}
      >
        <Animated.Image
          source={{
            uri: "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
          }}
          style={{
            width: "100%",
            height: "100%",
            transform: [
              { scale: s },
              // { translateX: translateXRef.current },
              // { translateY: translateYRef.current },
            ],
            //backgroundColor: "black",
          }}
          resizeMode="contain"
        ></Animated.Image>
      </PinchGestureHandler>
      {/* </Animated.View>
      </PanGestureHandler> */}
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewStyle: { height: "100%", width: "100%" },
  flatListStyle: {},
  textOnEmpty: {
    fontSize: 15,
    textAlign: "center",
  },
  viewOnEmpty: {},
  viewHeader: { paddingVertical: 30 },
  textHeader: { fontSize: 17, textAlign: "center" },
  viewFooter: { marginVertical: 35 },
});
