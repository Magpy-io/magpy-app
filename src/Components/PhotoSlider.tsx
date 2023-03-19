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
  RequestFullPhoto: (index: number) => void;
  fetchMore?: () => void;
  addPhotoLocal?: (index: number) => void;
  addPhotoServer?: (index: number) => void;
  deletePhotoLocal?: (index: number) => void;
  deletePhotoServer?: (index: number) => void;
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
      props.RequestFullPhoto(flatListCurrentIndex);
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
      {validFlatListCurrentIndex ? (
        <StatusBarComponent
          style={styles.statusBarStyle}
          inDevice={props.photos[flatListCurrentIndex].inDevice}
          inServer={props.photos[flatListCurrentIndex].inServer}
          onBackButton={() => props.onSwitchMode(flatListCurrentIndex)}
        />
      ) : (
        <></>
      )}

      {validFlatListCurrentIndex ? (
        <ToolBar
          style={styles.toolBarStyle}
          inDevice={props.photos[flatListCurrentIndex].inDevice}
          inServer={props.photos[flatListCurrentIndex].inServer}
          onAddLocal={() => props.addPhotoLocal?.(flatListCurrentIndex)}
          onAddServer={() => props.addPhotoServer?.(flatListCurrentIndex)}
          onDeleteLocal={() => props.deletePhotoLocal?.(flatListCurrentIndex)}
          onDeleteServer={() => props.deletePhotoServer?.(flatListCurrentIndex)}
        />
      ) : (
        <></>
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
  statusBarStyle: { position: "absolute", top: 0 },
  toolBarStyle: { position: "absolute", bottom: 0 },
});
