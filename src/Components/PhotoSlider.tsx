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
import StatusBarComponent from "./PhotoComponents/StatusBarComponent";
import ToolBar from "./PhotoComponents/ToolBar";
import PhotoSliderCore from "./PhotoSliderCore";

type PropsType = {
  photos: PhotoType[];
  startIndex: number;
  onSwitchMode: (index: number) => void;
  onEndReached: () => void;
  RequestFullPhoto: (index: number) => void;
  onPhotoClicked?: (index: number) => void;
  onDeleteAddLocal?: (index: number) => void;
  onDeleteAddServer?: (index: number) => void;
  onShare?: (index: number) => void;
  onDetails?: (index: number) => void;
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

  return (
    <>
      <PhotoSliderCore
        photos={props.photos}
        startIndex={props.startIndex}
        onSwitchMode={props.onSwitchMode}
        onIndexChanged={onCurrentIndexChanged}
        onEndReached={props.onEndReached}
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
          onDeleteAddLocal={() =>
            props.onDeleteAddLocal?.(flatListCurrentIndex)
          }
          onDeleteAddServer={() =>
            props.onDeleteAddServer?.(flatListCurrentIndex)
          }
          onDetails={() => props.onDetails?.(flatListCurrentIndex)}
          onShare={() => props.onShare?.(flatListCurrentIndex)}
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
