import { StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const END_POSITION = 270;

export default function App() {
  const onLeft = useSharedValue(true);
  const position = useSharedValue(0);
  const positionLast = useSharedValue(0);
  const positionY = useSharedValue(0);
  const positionYLast = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      positionY.value = positionYLast.value + e.translationY;
      position.value = positionLast.value + e.translationX;
    })
    .onEnd((e) => {
      positionYLast.value = positionY.value;
      positionLast.value = position.value;
    });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value },
      { translateY: positionY.value },
      { scale: scale.value },
    ],
  }));

  const composed = Gesture.Simultaneous(panGesture, pinchGesture);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 120,
    width: 120,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    marginBottom: 30,
  },
});
