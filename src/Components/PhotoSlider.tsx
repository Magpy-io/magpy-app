import {
  StyleSheet,
  BackHandler,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { PhotoType } from "~/Helpers/types";
import StatusBarComponent from "./PhotoComponents/StatusBarComponent";
import ToolBar from "./PhotoComponents/ToolBar";
import PhotoSliderCore from "./PhotoSliderCore";

type PropsType = {
  photos: Array<PhotoType>;
  style?: StyleProp<ViewStyle>;
  startIndex: number;
  onSwitchMode: (isPhotoSelected: boolean, index: number) => void;
  RequestFullPhoto: (photo: PhotoType) => void;
  fetchMore?: () => void;
  addPhotoLocal?: (photo: PhotoType) => void;
  addPhotoServer?: (photo: PhotoType) => void;
  deletePhotoLocal?: (photo: PhotoType) => void;
  deletePhotoServer?: (photo: PhotoType) => void;
};

function PhotoSlider(props: PropsType) {
  console.log("render slider");
  const flatListCurrentIndexRef = useRef<number>(props.startIndex);
  const [flatListCurrentIndex, setFlatListCurrentIndex] = useState(
    props.startIndex
  );

  const validFlatListCurrentIndex =
    props.photos.length != 0 && flatListCurrentIndex < props.photos.length;

  useEffect(() => {
    if (
      validFlatListCurrentIndex &&
      !props.photos[flatListCurrentIndex].inDevice
    ) {
      props.RequestFullPhoto(props.photos[flatListCurrentIndex]);
    }
  }, [props.photos, flatListCurrentIndex, validFlatListCurrentIndex]);

  const onCurrentIndexChanged = useCallback((index: number) => {
    flatListCurrentIndexRef.current = index;
    setFlatListCurrentIndex(index);
  }, []);

  useEffect(() => {
    const backAction = () => {
      props.onSwitchMode(false, flatListCurrentIndexRef.current);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [props.onSwitchMode]);

  useEffect(() => {
    if (props.photos.length == 0) {
      props.onSwitchMode(false, 0);
    }
  }, [props.photos.length, props.onSwitchMode]);

  return (
    <View style={[styles.mainViewStyle, props.style]}>
      <PhotoSliderCore
        photos={props.photos}
        startIndex={props.startIndex}
        onIndexChanged={onCurrentIndexChanged}
        onEndReached={props.fetchMore}
      />
      {validFlatListCurrentIndex && (
        <StatusBarComponent
          inDevice={props.photos[flatListCurrentIndex].inDevice}
          inServer={props.photos[flatListCurrentIndex].inServer}
          isLoading={props.photos[flatListCurrentIndex].isLoading}
          loadingPercentage={
            props.photos[flatListCurrentIndex].loadingPercentage
          }
          onBackButton={() => props.onSwitchMode(false, flatListCurrentIndex)}
        />
      )}

      {validFlatListCurrentIndex && (
        <ToolBar
          inDevice={props.photos[flatListCurrentIndex].inDevice}
          inServer={props.photos[flatListCurrentIndex].inServer}
          onAddLocal={() =>
            props.addPhotoLocal?.(props.photos[flatListCurrentIndex])
          }
          onAddServer={() =>
            props.addPhotoServer?.(props.photos[flatListCurrentIndex])
          }
          onDeleteLocal={() =>
            props.deletePhotoLocal?.(props.photos[flatListCurrentIndex])
          }
          onDeleteServer={() =>
            props.deletePhotoServer?.(props.photos[flatListCurrentIndex])
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewStyle: {
    height: "100%",
    width: "100%",
  },
});

export default PhotoSlider;
