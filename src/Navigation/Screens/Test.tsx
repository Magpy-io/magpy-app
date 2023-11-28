import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  Image,
  Text,
} from "react-native";
import { useRef, useCallback, useEffect, useState } from "react";
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

import { NativeEventEmitter, NativeModules } from "react-native";
const { MainModule } = NativeModules;

const ITEM_WIDTH = Dimensions.get("screen").width;

function keyExtractor(item: string, index: number) {
  return `Photo_${item}_index_${index}`;
}

function getItemLayout(data: any, index: number) {
  return {
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  };
}

const H = Dimensions.get("screen").height;
const W = Dimensions.get("screen").width;

export default function App() {
  useEffect(() => {
    MainModule.enableFullScreen();
  }, []);

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <TestPhotoComponent photo={item} />
  );

  return (
    <View style={styles.viewStyle}>
      <FlatList
        style={styles.flatListStyle}
        data={[
          "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
          "https://fastly.picsum.photos/id/186/200/300.jpg?hmac=OcvCqU_4x7ik3BASnw4WmwKaS-Sv167Nmf5CJoTrIUs",
          "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
          "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
        ]}
        renderItem={renderItem}
        //initialNumToRender={10}
        // viewabilityConfig={{
        //   itemVisiblePercentThreshold: 90,
        // }}
        horizontal={true}
        snapToAlignment="start"
        disableIntervalMomentum={true}
        decelerationRate={"normal"}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={5}
        getItemLayout={getItemLayout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    height: "100%",
    width: "100%",
    backgroundColor: "red",
  },
  flatListStyle: { height: "100%", width: "100%", backgroundColor: "blue" },
  itemStyle: {
    justifyContent: "center",
    // width: "100%",
    backgroundColor: "white",
  },
  imageStyle: {
    width: W,
    height: "100%",
    borderRadius: 0,
    backgroundColor: "white",
  },
});

function TestPhotoComponent(props: { photo: string }) {
  const position = useSharedValue(0);
  const positionLast = useSharedValue(0);
  const positionY = useSharedValue(0);
  const positionYLast = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const [en, setEn] = useState(false);

  const panGesture = Gesture.Pan()
    .enabled(en)
    .onUpdate((e) => {
      const newY = positionYLast.value + e.translationY / scale.value;
      positionY.value = newY;
      if (newY > (H * (scale.value - 1)) / 2 / scale.value) {
        positionY.value = (H * (scale.value - 1)) / 2 / scale.value;
      } else if (newY < (-H * (scale.value - 1)) / 2 / scale.value) {
        positionY.value = (-H * (scale.value - 1)) / 2 / scale.value;
      } else {
        positionY.value = newY;
      }

      const newX = positionLast.value + e.translationX / scale.value;
      if (newX > (W * (scale.value - 1)) / 2 / scale.value) {
        position.value = (W * (scale.value - 1)) / 2 / scale.value;
      } else if (newX < (-W * (scale.value - 1)) / 2 / scale.value) {
        position.value = (-W * (scale.value - 1)) / 2 / scale.value;
      } else {
        position.value = newX;
      }
    })
    .onEnd((e) => {
      positionYLast.value = positionY.value;
      positionLast.value = position.value;
      console.log(positionLast.value, positionYLast.value);
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      if (savedScale.value * e.scale < 1) {
        scale.value = 1;
      } else if (savedScale.value * e.scale > 5) {
        scale.value = 5;
      } else {
        scale.value = savedScale.value * e.scale;
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      if (scale.value > 1) {
        runOnJS(setEn)(true);
      } else {
        runOnJS(setEn)(false);
      }
    });

  const composed = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: position.value },
      { translateY: positionY.value },
    ],
  }));

  return (
    <TouchableWithoutFeedback onPress={() => console.log("touched")}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.itemStyle, animatedStyle]}>
          <Image
            source={{
              uri: props.photo,
            }}
            resizeMode={"contain"}
            style={[styles.imageStyle]}
          />
        </Animated.View>
      </GestureDetector>
    </TouchableWithoutFeedback>
  );
}
