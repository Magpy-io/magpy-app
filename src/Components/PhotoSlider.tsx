import { StyleSheet, BackHandler } from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";
import { PhotoType } from "~/Helpers/types";
import StatusBarComponent from "./PhotoComponents/StatusBarComponent";
import ToolBar from "./PhotoComponents/ToolBar";
import PhotoSliderCore from "./PhotoSliderCore";

type PropsType = {
  photos: Array<PhotoType>;
  startIndex: number;
  onSwitchMode: (index: number) => void;
  RequestFullPhoto: (photo: PhotoType) => void;
  fetchMore?: () => void;
  addPhotoLocal?: (photo: PhotoType) => void;
  addPhotoServer?: (photo: PhotoType) => void;
  deletePhotoLocal?: (photo: PhotoType) => void;
  deletePhotoServer?: (photo: PhotoType) => void;
};

export default function PhotoSlider(props: PropsType) {
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
      props.onSwitchMode(flatListCurrentIndexRef.current);
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
      props.onSwitchMode(0);
    }
  }, [props.photos.length, props.onSwitchMode]);

  return (
    <>
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
          onBackButton={() => props.onSwitchMode(flatListCurrentIndex)}
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
});