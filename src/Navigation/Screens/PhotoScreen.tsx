import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import { Dimensions } from "react-native";

import { Icon } from "@rneui/themed";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PhotoStackParamList } from "../Navigation";
import colors from "~/colors";
import ToolBar from "~/Components/PhotoComponents/ToolBar";
import StatusBarComponent from "~/Components/PhotoComponents/StatusBarComponent";
import BackButton from "~/Components/CommonComponents/BackButton";
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from "react-native-navigation-bar-color";
const windowHeight = Dimensions.get("window").height;

type PropsPhotoScreen = NativeStackScreenProps<
  PhotoStackParamList,
  "PhotoPage"
>;

export default function PhotoScreen(props: PropsPhotoScreen) {
  const photo = props.route.params.photo;
  const [barsHidden, setBarsHidden] = useState(false);

  const slideUp = useRef(new Animated.Value(0)).current;
  const slideDown = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideDown, {
      toValue: barsHidden ? 200 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideDown, barsHidden]);

  useEffect(() => {
    Animated.timing(slideUp, {
      toValue: barsHidden ? -200 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideUp, barsHidden]);

  useEffect(() => {
    barsHidden ? hideNavigationBar() : showNavigationBar();
  }, [barsHidden]);

  function hideOrShow() {
    setBarsHidden(!barsHidden);
  }

  return (
    <View style={styles.viewStyle}>
      <StatusBar
        backgroundColor={"white"}
        barStyle="dark-content"
        hidden={barsHidden}
      />
      <TouchableWithoutFeedback onPress={hideOrShow}>
        <Image
          source={{ uri: photo.image.path }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </TouchableWithoutFeedback>

      <Animated.View style={{ transform: [{ translateY: slideUp }] }}>
        <StatusBarComponent photo={photo} style={{ top: -windowHeight }} />
        <BackButton style={{ top: -windowHeight }} />
      </Animated.View>

      <Animated.View style={{ transform: [{ translateY: slideDown }] }}>
        <ToolBar photo={photo} />
      </Animated.View>

      {/* {!barsHidden ? (
        <>
          <StatusBarComponent photo={photo} />
          <ToolBar photo={photo} />
          <BackButton />
        </>
      ) : (
        <></>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: "black",
  },
});
